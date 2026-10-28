import { Payment } from "../../../modules/payments/entities/payment.entity.js";
import { PaymentEntity } from "./payment.orm-entity.js";

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    return new Payment(
      entity.paymentId,
      entity.orderId,
      entity.status,
      entity.amount,
      entity.paidAt,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
    );
  }

  static toPersistence(payment: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.paymentId = payment.paymentId;
    entity.orderId = payment.orderId;
    entity.status = payment.status;
    entity.amount = payment.amount;
    entity.paidAt = payment.paidAt;
    // createdAt/updatedAt/deletedAt ficam de fora: o banco os gera.
    return entity;
  }
}
