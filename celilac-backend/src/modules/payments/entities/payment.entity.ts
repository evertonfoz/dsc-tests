// import { PaymentStatus } from "../../../common/enum/payment-status.enum.js";

// export class Payment {
//     private status: PaymentStatus;

//     constructor(
//         public readonly paymentId: string,
//         public readonly orderId: string,
//         status: PaymentStatus,
//         public readonly createdAt: Date = new Date(),
//         public readonly updatedAt: Date = new Date(),
//         public readonly deletedAt: Date | null = null,
//     ) {
//         this.status = status ?? PaymentStatus.PENDING;
//     }