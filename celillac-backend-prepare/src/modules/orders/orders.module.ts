import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../infrastructure/persistence/orders/order.orm-entity.js';
import { PaymentEntity } from '../../infrastructure/persistence/payments/payment.orm-entity.js';
import { TypeOrmOrdersRepository } from '../../infrastructure/persistence/orders/typeorm-orders.repository.js';
import { TypeOrmPaymentsRepository } from '../../infrastructure/persistence/payments/typeorm-payments.repository.js';
import { PAYMENTS_REPOSITORY } from '../payments/repositories/payments.repository.interface.js';
import { ORDERS_REPOSITORY } from './repositories/orders.repository.interface.js';
import { OrdersService } from './services/orders.service.js';
import { OrdersController } from './controllers/orders.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      PaymentEntity,
    ]),
  ],
  controllers: [
    OrdersController,
  ],
  providers: [
    OrdersService,
    TypeOrmOrdersRepository,
    TypeOrmPaymentsRepository,
    {
      provide: ORDERS_REPOSITORY,
      useExisting: TypeOrmOrdersRepository,
    },
    {
      provide: PAYMENTS_REPOSITORY,
      useExisting: TypeOrmPaymentsRepository,
    },
  ],
})
export class OrdersModule {}