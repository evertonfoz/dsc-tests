import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductOrmEntity {
  @PrimaryColumn({
    type: 'uuid',
    name: 'productId',
  })
  productId!: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: false,
  })
  name!: string;
}
