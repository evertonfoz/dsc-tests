import { Inject, Injectable } from '@nestjs/common';
import {
  ORDERS_REPOSITORY,
  type OrdersRepository,
} from '../repositories/orders.repository.interface.js';
import { OrderNotFoundException } from '../../../common/exceptions/order-not-found.exception.js';
import {
  PAYMENTS_REPOSITORY,
  type PaymentsRepository
} from '../../payments/repositories/payments.repository.interface.js';
import { PaymentNotFoundException } from '../../../common/exceptions/payment-not-found.exception.js';
import { PaymentNotApprovedException } from '../../../common/exceptions/payment-not-approved.exception.js';
import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';
import { ConfirmOrderResponseDto } from '../dtos/confirm-order-response.dto.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: PaymentsRepository,
  ) { }

  async confirmOrder(orderId: string): Promise<ConfirmOrderResponseDto> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new OrderNotFoundException(orderId);
    }

    if (order.getStatus() === 'CONFIRMED') {
      throw new OrderAlreadyConfirmedException(orderId);
    }

    const payment = await this.paymentsRepository.findByOrderId(orderId);

    if (!payment) {
      throw new PaymentNotFoundException(orderId);
    }

    if (payment.status !== PaymentStatus.APPROVED) {
      throw new PaymentNotApprovedException(payment.status);
    }

    order.confirm(payment.status);

    const savedOrder = await this.ordersRepository.save(order);

    return {
      orderId: savedOrder.orderId,
      status: savedOrder.getStatus(),
      updatedAt: savedOrder.updatedAt,
      message: 'Order confirmed successfully.',
    };
  }
}
