import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module.js";
import { TypeOrmOrdersRepository } from "../infrastructure/persistence/orders/typeorm-orders.repository.js";
import { OrdersService } from "../modules/orders/services/orders.service.js";
import { OrderStatus } from "../common/enums/order-status.enum.js";
import { PaymentStatus } from "../common/enums/payment-status.enum.js";
import { OrderEntity } from "../infrastructure/persistence/orders/order.orm-entity.js";
import { randomUUID } from "crypto";
import { DataSource } from "typeorm";
import { OrderMapper } from "../infrastructure/persistence/orders/order.orm-mapper.js";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const ordersRepository = app.get(TypeOrmOrdersRepository);
  const ordersService = app.get(OrdersService);

  // 1. Construir e persistir um pedido pelo repositório concreto
  const orderId = randomUUID();
  const orderEntity = new OrderEntity();
  orderEntity.orderId = orderId;
  orderEntity.customerId = randomUUID();
  orderEntity.status = OrderStatus.PENDING;
  const order = OrderMapper.toDomain(orderEntity);
  await ordersRepository.save(order);
  console.log('Pedido persistido:', orderId);

  
  // 3. Recuperar o pedido pelo repositório para confirmar a leitura
  const found = await ordersRepository.findById(orderId);
  console.log('Pedido recuperado:', found?.orderId, '| status:', found?.getStatus());
  console.log('  createdAt:', found?.createdAt, '| updatedAt:', found?.updatedAt);

  // 4. Executar o UC07 pelo fluxo de aplicação
  const response = await ordersService.confirmOrder(orderId);
  console.log('confirmOrder() executado. updatedAt na resposta:', response.updatedAt);

  // 5. Consultar novamente para verificar o estado persistido
  const confirmed = await ordersRepository.findById(orderId);
  console.log('Estado após confirmação:', confirmed?.getStatus());
  console.log('  createdAt:', confirmed?.createdAt, '| updatedAt:', confirmed?.updatedAt);

  // 6. UPDATE fora do TypeORM: o trigger do banco deve atualizar updatedAt
  await app.get(DataSource).query(
    `UPDATE "orders"."orders" SET "status" = 'CONFIRMED' WHERE "orderId" = $1`,
    [orderId],
  );
  const touched = await ordersRepository.findById(orderId);
  console.log('updatedAt após UPDATE em SQL puro:', touched?.updatedAt);

  // 7. Soft delete: o registro some das buscas, mas continua no banco
  await ordersRepository.softDelete(orderId);
  const deleted = await ordersRepository.findById(orderId);
  console.log('Pedido após softDelete():', deleted === null ? 'não encontrado' : 'ainda visível');

  await app.close();
}

bootstrap().catch(console.error);