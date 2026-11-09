import 'dotenv/config';
import { DataSource } from 'typeorm';
import { OrderEntity } from '../infrastructure/persistence/orders/order.orm-entity.js';
import { PaymentEntity } from '../infrastructure/persistence/payments/payment.orm-entity.js';
import { ProductOrmEntity } from '../infrastructure/persistence/products/product.orm-entity.js';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [OrderEntity, PaymentEntity, ProductOrmEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
