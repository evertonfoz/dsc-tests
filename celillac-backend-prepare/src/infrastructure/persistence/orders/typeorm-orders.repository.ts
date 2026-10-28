import { Injectable } from "@nestjs/common";
import { OrdersRepository } from "../../../modules/orders/repositories/orders.repository.interface.js";
import { OrderEntity } from "./order.orm-entity.js";
import { Repository } from "typeorm/repository/Repository.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "../../../modules/orders/entities/order.entity.js";
import { OrderMapper } from "./order.mapper.js";

@Injectable()
export class TypeOrmOrdersRepository implements OrdersRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repository: Repository<OrderEntity>,
    ) { }
    async save(order: Order): Promise<Order> {
        const entity = OrderMapper.toPersistence(order);
        const savedEntity = await this.repository.save(entity);
        return OrderMapper.toDomain(savedEntity);
    }


    async findById(orderId: string): Promise<Order | null> {
        const entity = await this.repository.findOne({
            where: { orderId },
        });

        if (!entity) {
            return null;
        }

        return OrderMapper.toDomain(entity);
    }

    async softDelete(orderId: string): Promise<void> {
        await this.repository.softDelete({ orderId });
    }
}