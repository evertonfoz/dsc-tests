import { Inject, Injectable } from "@nestjs/common";
import { ORDERS_REPOSITORY, type IOrdersRepository } from "../repositories/orders.repository.interface.js";
import { OrderNotFoundException } from "../../../common/exceptions/order-not-found.exception.js";
import { OrderStatus } from "../../../common/enum/order-status.enum.js";
import { OrderAlreadyConfirmedException } from "../../../common/exceptions/order-already-confirmed.exception.js";

@Injectable()
export class OrdersService {
    constructor(
        @Inject(ORDERS_REPOSITORY)
        private readonly orderRepository: IOrdersRepository
    ) {}
    async confirmOrder(orderId: string): Promise<any> {
        const order = await this.orderRepository.findOrderById(orderId);

        if (!order) {
            throw new OrderNotFoundException();
        }

        if (order.status === OrderStatus.CONFIRMED) {
            throw new OrderAlreadyConfirmedException();
        }


    }
}