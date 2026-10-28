import { Order } from '../entities/order.entity.js';

export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';

export interface OrdersRepository {
  findById(orderId: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  softDelete(orderId: string): Promise<void>;
}