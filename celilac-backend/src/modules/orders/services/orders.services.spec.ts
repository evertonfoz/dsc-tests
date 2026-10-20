import { Test, TestingModule } from '@nestjs/testing';
import {
    beforeEach,
    describe,
    it,
    Mocked,
    vi,
} from 'vitest';
import {
    ORDERS_REPOSITORY,
    OrdersRepository,
} from '../repositories/orders.repository.interface.js';
// OrdersRepository: tipo do contrato — usado como referência para o test double
// ORDERS_REPOSITORY: token de injeção — usado no TestingModule
import { OrdersService } from './orders.service.js';
import { OrderNotFoundException } from '../../../common/exceptions/order-not-found.exception.js';
import { PAYMENTS_REPOSITORY, PaymentsRepository } from '../../payments/repositories/payments.repository.interface.js';
import { PaymentNotFoundException } from '../../../common/exceptions/payment-not-found.exception.js';
import { Order } from '../entities/order.entity.js';
import { OrderStatus } from '../../../common/enums/order-status.enum.js';
import { Payment } from '../../payments/entities/payment.entity.js';
import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';
import { PaymentNotApprovedException } from '../../../common/exceptions/payment-not-approved.exception.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';

const ORDER_ID = 'order-id';

// Order válido e confirmável por padrão; o teste sobrescreve só o status
function makeOrder(status: OrderStatus = OrderStatus.PENDING): Order {
    return new Order(ORDER_ID, 'customer-id', status, new Date(), new Date());
}

// Payment válido e aprovado por padrão; o teste sobrescreve só o status
function makePayment(status: PaymentStatus = PaymentStatus.APPROVED): Payment {
    return new Payment('payment-id', ORDER_ID, status, 100, null, new Date(), new Date());
}

describe('OrdersService', () => {
    let service: OrdersService;
    let ordersRepository: {
        findById: ReturnType<typeof vi.fn>;
        save: ReturnType<typeof vi.fn>;
    };
    let paymentsRepository: Mocked<PaymentsRepository>;

    beforeEach(async () => {
        const ordersRepositoryMock = {
            findById: vi.fn(),
            save: vi.fn(),
        };

        const paymentsRepositoryMock: Mocked<PaymentsRepository> = {
            findByOrderId: vi.fn(),
            save: vi.fn(),
            softDelete: vi.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: ORDERS_REPOSITORY,
                    useValue: ordersRepositoryMock,
                },
                {
                    provide: PAYMENTS_REPOSITORY,
                    useValue: paymentsRepositoryMock,
                },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        ordersRepository = module.get(ORDERS_REPOSITORY);
        paymentsRepository = module.get(PAYMENTS_REPOSITORY);
    })

    it('should throw OrderNotFoundException when order does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(null);
        await expect(
            service.confirmOrder('order-id-inexistente'),
            // Chama confirmOrder com um orderId qualquer.
            // O service está disponível porque o beforeEach o inicializou.
        ).rejects.toThrow(OrderNotFoundException);

        expect(
            paymentsRepository.findByOrderId,
        ).not.toHaveBeenCalled();
    });

    it('should throw PaymentNotFoundException when payment does not exist', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(null);

        await expect(
            service.confirmOrder(ORDER_ID),
        ).rejects.toThrow(PaymentNotFoundException);

        expect(ordersRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when payment is pending', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(
            makePayment(PaymentStatus.PENDING),
        );

        await expect(
            service.confirmOrder(ORDER_ID),
        ).rejects.toThrow(PaymentNotApprovedException);

        expect(ordersRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when payment is rejected', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder());
        paymentsRepository.findByOrderId.mockResolvedValue(
            makePayment(PaymentStatus.REJECTED),
        );

        await expect(
            service.confirmOrder(ORDER_ID),
        ).rejects.toThrow(PaymentNotApprovedException);

        expect(ordersRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when order is already confirmed', async () => {
        ordersRepository.findById.mockResolvedValue(makeOrder(OrderStatus.CONFIRMED));
        paymentsRepository.findByOrderId.mockResolvedValue(
            makePayment(PaymentStatus.APPROVED),
        );

        await expect(
            service.confirmOrder(ORDER_ID),
        ).rejects.toThrow(OrderAlreadyConfirmedException);

        expect(ordersRepository.save).not.toHaveBeenCalled();
    });

    it('should confirm order when payment is approved', async () => {
        const order = makeOrder(OrderStatus.PENDING);

        ordersRepository.findById.mockResolvedValue(order);
        paymentsRepository.findByOrderId.mockResolvedValue(
            makePayment(PaymentStatus.APPROVED),
        );
        ordersRepository.save.mockImplementation(async (input) => input);

        const result = await service.confirmOrder(ORDER_ID);

        expect(ordersRepository.save).toHaveBeenCalledTimes(1);
        expect(ordersRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                orderId: ORDER_ID,
                status: OrderStatus.CONFIRMED,
            }),
        );

        expect(result).toEqual({
            orderId: ORDER_ID,
            status: OrderStatus.CONFIRMED,
            updatedAt: expect.any(Date),
            message: 'Order confirmed successfully.',
        });
    });
});