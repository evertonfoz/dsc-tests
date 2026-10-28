import { OrderStatus } from 
   '../../../common/enums/order-status.enum.js';

export class ConfirmOrderResponseDto {
  orderId!: string;
  status!: OrderStatus;
  updatedAt!: Date;
  message!: string;
}