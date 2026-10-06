// import { OrderStatus } from "../../../common/enum/order-status.enum.js";

// export class Order {
//     private status: OrderStatus;    
    
//     constructor(
//         public readonly orderId: string,
//         public readonly customerId: string,
//         status : OrderStatus,
//         public readonly createdAt: Date = new Date(),
//         public readonly updatedAt: Date = new Date(),
//         public readonly deletedAt: Date | null = null,
//     ) {
//         this.status = status?? OrderStatus.PENDING
//     }

//     public getStatus(): OrderStatus {
//         return this.status;
//     }

//     public confirmOrder(): void {
//         if (this.status === OrderStatus.CONFIRMED) {
//             throw new Error('Order is already confirmed.');
//         }
//         this.status = OrderStatus.CONFIRMED;
//     }
// }