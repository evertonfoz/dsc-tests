import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "../../infrastructure/persistence/orders/order.orm-entity.js";
import { OrdersService } from "./services/orders.service.js";
import { TypeOrmOrdersRepository } from "../../infrastructure/persistence/orders/typeorm-orders.repository.js";
import { ORDERS_REPOSITORY } from "./repositories/orders.repository.interface.js";
import { OrdersController } from "./controllers/orders.controller.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity,])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TypeOrmOrdersRepository,
    {
      provide: ORDERS_REPOSITORY,
      useClass: TypeOrmOrdersRepository
    }
  ],
  exports: []
})
export class OrdersModule {}