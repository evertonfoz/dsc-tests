import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service.js';
import { ConfirmOrderResponseDto } from '../dtos/confirm-order-response.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('id', new ParseUUIDPipe()) orderId: string) : Promise<ConfirmOrderResponseDto>  {
    return this.ordersService.confirmOrder(orderId);
  }
}