import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { OrderNotFoundException } from '../../../common/exceptions/order-not-found.exception.js';
import { ORDERS_REPOSITORY } from '../repositories/orders.repository.interface.js';
import { OrderStatus } from '../../../common/enum/order-status.enum.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';

const ORDER_ID = '1';

describe('OrdersService', () => {
    let ordersService: OrdersService;
    let ordersRepository: {
        findOrderById: ReturnType<typeof vi.fn>;
    }

    beforeEach(async () => {
        const ordersRepositoryMock = {
            findOrderById: vi.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                {
                    provide: ORDERS_REPOSITORY,
                    useValue: ordersRepositoryMock,
                },
            ],
        }).compile();

        ordersService = module.get<OrdersService>(OrdersService);
        ordersRepository = module.get('ORDERS_REPOSITORY');
    });

    it('should throw OrderNotFoundException when order is not found', async () => {
        ordersRepository.findOrderById.mockResolvedValue(null);

        await expect(ordersService.confirmOrder('1')).rejects.toThrow(OrderNotFoundException);
    });

    it('should fail when order is already confirmed', async () => {
        ordersRepository.findOrderById.mockResolvedValue({
            orderId: ORDER_ID,
            status: OrderStatus.CONFIRMED,
        });

        await expect(ordersService.confirmOrder(ORDER_ID)).rejects.toThrow(OrderAlreadyConfirmedException);
    });
});