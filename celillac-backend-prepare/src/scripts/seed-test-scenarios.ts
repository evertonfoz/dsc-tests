import { NestFactory } from "@nestjs/core";
import { randomUUID } from "crypto";
import { writeFileSync } from "fs";
import { AppModule } from "../app.module.js";
import { TypeOrmOrdersRepository } from "../infrastructure/persistence/orders/typeorm-orders.repository.js";
import { TypeOrmPaymentsRepository } from "../infrastructure/persistence/payments/typeorm-payments.repository.js";
import { OrdersService } from "../modules/orders/services/orders.service.js";
import { OrderStatus } from "../common/enums/order-status.enum.js";
import { PaymentStatus } from "../common/enums/payment-status.enum.js";
import { OrderEntity } from "../infrastructure/persistence/orders/order.orm-entity.js";
import { OrderMapper } from "../infrastructure/persistence/orders/order.mapper.js";
import { PaymentEntity } from "../infrastructure/persistence/payments/payment.orm-entity.js";
import { PaymentMapper } from "../infrastructure/persistence/payments/payment.mapper.js";

// Prepara dados reais para cada cenário do UC07 (confirmar pedido).
// Tudo passa pelos repositórios e pelo serviço da aplicação: nenhum SQL manual.

type Scenario = {
  title: string;
  orderId: string;
  expected: string;
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const ordersRepository = app.get(TypeOrmOrdersRepository);
  const paymentsRepository = app.get(TypeOrmPaymentsRepository);
  const ordersService = app.get(OrdersService);

  async function createPendingOrder(): Promise<string> {
    const orderEntity = new OrderEntity();
    orderEntity.orderId = randomUUID();
    orderEntity.customerId = randomUUID();
    orderEntity.status = OrderStatus.PENDING;
    const saved = await ordersRepository.save(OrderMapper.toDomain(orderEntity));
    return saved.orderId;
  }

  async function createPayment(orderId: string, status: PaymentStatus): Promise<void> {
    const paymentEntity = new PaymentEntity();
    paymentEntity.paymentId = randomUUID();
    paymentEntity.orderId = orderId;
    paymentEntity.status = status;
    paymentEntity.amount = 150.0;
    paymentEntity.paidAt = status === PaymentStatus.APPROVED ? new Date() : null;
    await paymentsRepository.save(PaymentMapper.toDomain(paymentEntity));
  }

  const scenarios: Scenario[] = [];

  // 1. Pedido existente com pagamento aprovado
  const approvedOrderId = await createPendingOrder();
  await createPayment(approvedOrderId, PaymentStatus.APPROVED);
  scenarios.push({
    title: "Pedido existente com pagamento aprovado",
    orderId: approvedOrderId,
    expected: "200 OK",
  });

  // 2. Pedido inexistente: UUID válido que nunca foi persistido
  const missingOrderId = randomUUID();
  scenarios.push({
    title: "Pedido inexistente",
    orderId: missingOrderId,
    expected: "404 OrderNotFoundException",
  });

  // 3. Pedido existente sem pagamento associado
  const withoutPaymentOrderId = await createPendingOrder();
  scenarios.push({
    title: "Pedido existente sem pagamento associado",
    orderId: withoutPaymentOrderId,
    expected: "404 PaymentNotFoundException",
  });

  // 4. Pedido com pagamento não aprovado (PENDING e REJECTED)
  const pendingPaymentOrderId = await createPendingOrder();
  await createPayment(pendingPaymentOrderId, PaymentStatus.PENDING);
  scenarios.push({
    title: "Pedido com pagamento não aprovado (PENDING)",
    orderId: pendingPaymentOrderId,
    expected: "422 PaymentNotApprovedException",
  });

  const rejectedPaymentOrderId = await createPendingOrder();
  await createPayment(rejectedPaymentOrderId, PaymentStatus.REJECTED);
  scenarios.push({
    title: "Pedido com pagamento não aprovado (REJECTED)",
    orderId: rejectedPaymentOrderId,
    expected: "422 PaymentNotApprovedException",
  });

  // 5. Pedido já confirmado: chega a CONFIRMED pelo próprio UC07
  const confirmedOrderId = await createPendingOrder();
  await createPayment(confirmedOrderId, PaymentStatus.APPROVED);
  await ordersService.confirmOrder(confirmedOrderId);
  scenarios.push({
    title: "Pedido já confirmado",
    orderId: confirmedOrderId,
    expected: "409 OrderAlreadyConfirmedException",
  });

  // 6. Identificador malformado: barrado pelo ParseUUIDPipe, nada a persistir
  scenarios.push({
    title: "Identificador malformado",
    orderId: "abc-123",
    expected: "400 Bad Request (ParseUUIDPipe)",
  });

  // Conferência: relê cada cenário pelos repositórios
  console.log("\nCenários preparados:\n");
  for (const scenario of scenarios) {
    const isUuid = scenario.orderId !== "abc-123";
    const order = isUuid ? await ordersRepository.findById(scenario.orderId) : null;
    const payment = isUuid ? await paymentsRepository.findByOrderId(scenario.orderId) : null;
    console.log(`- ${scenario.title}`);
    console.log(`    orderId:   ${scenario.orderId}`);
    console.log(`    pedido:    ${order ? order.getStatus() : "—"}`);
    console.log(`    pagamento: ${payment ? payment.status : "—"}`);
    console.log(`    esperado:  ${scenario.expected}`);
  }

  // Gera requisições prontas para o REST Client
  const port = process.env.PORT ?? 3200;
  const http = [
    `@baseUrl = http://localhost:${port}`,
    "",
    `# Gerado por src/scripts/seed-test-scenarios.ts em ${new Date().toISOString()}`,
    ...scenarios.flatMap((scenario) => [
      "",
      `### ${scenario.title} → esperado: ${scenario.expected}`,
      `POST {{baseUrl}}/orders/${scenario.orderId}/confirm`,
    ]),
    "",
  ].join("\n");
  const httpPath = "http-rest-client/orders/test-scenarios.http";
  writeFileSync(httpPath, http);
  console.log(`\nRequisições gravadas em ${httpPath}`);

  await app.close();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
