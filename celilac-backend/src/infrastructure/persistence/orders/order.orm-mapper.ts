import { Order } from "../../../modules/orders/entities/order.entity.js";
import { OrderEntity } from "./order.orm-entity.js";

export class OrderMapper{
    static toDomain(orderEntity: OrderEntity): Order {
        return new Order(
            orderEntity.orderId,
            orderEntity.customerId,
            orderEntity.status,
            orderEntity.createdAt,
            orderEntity.updatedAt,
            orderEntity.deletedAt
        );
    }

    static toPersistence(order: Order): OrderEntity {
        const orderEntity = new OrderEntity();
        orderEntity.orderId = order.orderId;
        orderEntity.customerId = order.customerId;
        orderEntity.status = order.getStatus();
        orderEntity.createdAt = order.createdAt;
        orderEntity.updatedAt = order.updatedAt;
        orderEntity.deletedAt = order.deletedAt;
        return orderEntity;
    }
}