export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';

export interface IOrdersRepository {
  findOrderById(orderId: string): Promise<any | null>;
}