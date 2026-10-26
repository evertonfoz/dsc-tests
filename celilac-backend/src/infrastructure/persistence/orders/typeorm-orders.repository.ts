import { Injectable } from "@nestjs/common";
import { Order } from "../../../modules/orders/entities/order.entity.js";
import { OrdersRepository } from "../../../modules/orders/repositories/orders.repository.interface.js";
import { Repository } from "typeorm/repository/Repository.js";
import { OrderEntity } from "./order.orm-entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderMapper } from "./order.orm-mapper.js";

@Injectable()
export class TypeOrmOrdersRepository implements OrdersRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>
    ) {
    }

    async findById(orderId: string): Promise<Order | null> {
        const orderEntity = await this.repository.findOne({ where: { orderId } });
        if (!orderEntity) {
            return null;
        }
        return OrderMapper.toDomain(orderEntity);
    }
    async save(order: Order): Promise<Order> {
        const entity = OrderMapper.toPersistence(order);
        const savedEntity = await this.repository.save(entity);
        return OrderMapper.toDomain(savedEntity);
        
//        return this.repository.save(entity).then(savedEntity => OrderMapper.toDomain(savedEntity));
    }
    softDelete(orderId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}