import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentsRepository } from "../../../modules/payments/repositories/payments.repository.interface.js";
import { PaymentEntity } from "./payment.orm-entity.js";
import { PaymentMapper } from "./payment.mapper.js";
import { Payment } from "../../../modules/payments/entities/payment.entity.js";

@Injectable()
export class TypeOrmPaymentsRepository implements PaymentsRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repository: Repository<PaymentEntity>,
  ) { }
  async save(payment: Payment): Promise<Payment> {
    const entity = PaymentMapper.toPersistence(payment);
    const savedEntity = await this.repository.save(entity);
    return PaymentMapper.toDomain(savedEntity);
  }

  async findByOrderId(orderId: string) {
    const entity = await this.repository.findOne({
      where: { orderId },
    });

    if (!entity) {
      return null;
    }

    return PaymentMapper.toDomain(entity);
  }

  async softDelete(paymentId: string): Promise<void> {
    await this.repository.softDelete({ paymentId });
  }
}