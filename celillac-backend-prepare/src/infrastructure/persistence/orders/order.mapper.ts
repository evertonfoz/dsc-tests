import { Order } from "../../../modules/orders/entities/order.entity.js";
import { OrderEntity } from "./order.orm-entity.js";

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    return new Order(
      entity.orderId,
      entity.customerId,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toPersistence(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.orderId = order.orderId;
    entity.customerId = order.customerId;
    entity.status = order.getStatus();
    // createdAt/updatedAt/deletedAt ficam de fora: o banco os gera.
    return entity;
  }
}
