import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module.js';
import { OrderStatus } from '../../src/common/enums/order-status.enum.js';
import { PaymentStatus } from '../../src/common/enums/payment-status.enum.js';
import { OrderEntity } from '../../src/infrastructure/persistence/orders/order.orm-entity.js';
import { PaymentEntity } from '../../src/infrastructure/persistence/payments/payment.orm-entity.js';

// UC07 — POST /orders/:id/confirm
// Teste E2E: sobe a aplicação Nest real, com banco real (Postgres do compose.yaml).

describe('POST /orders/:id/confirm (e2e)', () => {
  let app: INestApplication<App>;
  let ordersRepository: Repository<OrderEntity>;
  let paymentsRepository: Repository<PaymentEntity>;

  const createdOrderIds: string[] = [];

  // 1. Preparar o ambiente de teste + 2. Inicializar a aplicação NestJS
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    ordersRepository = app.get(getRepositoryToken(OrderEntity));
    paymentsRepository = app.get(getRepositoryToken(PaymentEntity));
  });

  // 7. Encerrar os recursos utilizados: remove os dados do cenário e fecha a app
  afterAll(async () => {
    if (createdOrderIds.length > 0) {
      await paymentsRepository.delete(
        createdOrderIds.map((orderId) => ({ orderId })),
      );
      await ordersRepository.delete(createdOrderIds);
    }
    await app.close();
  });

  it('confirma um pedido pendente com pagamento aprovado (200)', async () => {
    // 3. Preparar os dados necessários ao cenário
    const order = await ordersRepository.save(
      ordersRepository.create({
        customerId: randomUUID(),
        status: OrderStatus.PENDING,
      }),
    );
    createdOrderIds.push(order.orderId);

    await paymentsRepository.save(
      paymentsRepository.create({
        orderId: order.orderId,
        status: PaymentStatus.APPROVED,
        amount: 150.0,
        paidAt: new Date(),
      }),
    );

    // 4. Enviar a requisição HTTP + 5. Verificar o status
    const response = await request(app.getHttpServer())
      .post(`/orders/${order.orderId}/confirm`)
      .expect(200);

    // 6. Verificar o corpo da resposta
    expect(response.body).toEqual({
      orderId: order.orderId,
      status: OrderStatus.CONFIRMED,
      updatedAt: expect.any(String),
      message: 'Order confirmed successfully.',
    });

    // Confirma que a mudança foi de fato persistida
    const persisted = await ordersRepository.findOneByOrFail({
      orderId: order.orderId,
    });
    expect(persisted.status).toBe(OrderStatus.CONFIRMED);
  });
});
