import { PaymentStatus } from '../../../common/enums/payment-status.enum.js';
import { OrderStatus } from '../../../common/enums/order-status.enum.js';
import { OrderAlreadyConfirmedException } from '../../../common/exceptions/order-already-confirmed.exception.js';

export class Order {
  private status: OrderStatus;

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    status: OrderStatus,
    // Datas geradas pelo banco; o domínio apenas as lê.
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null = null,
  ) {
    this.status = status;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  // A forma de representar a falha será tratada na Etapa 4
  confirm(paymentStatus: PaymentStatus): void {
    if (this.status === OrderStatus.CONFIRMED) {
      throw new OrderAlreadyConfirmedException(this.orderId);
    }
    if (paymentStatus !== PaymentStatus.APPROVED) {
      // pagamento não aprovado — operação inválida
      // como comunicar isso? → Etapa 4
      return;
    }
    this.status = OrderStatus.CONFIRMED;
  }
}