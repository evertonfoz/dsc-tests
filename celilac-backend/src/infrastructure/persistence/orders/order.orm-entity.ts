import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../../../common/enums/order-status.enum.js";

@Entity({ name: 'orders', schema: 'orders' })
export class OrderEntity{
    @PrimaryGeneratedColumn('uuid')
    orderId: string;

    @Column({ type: 'uuid'}) // GUID
    customerId: string;

    @Column({ type: 'enum', enum: OrderStatus })
    status: OrderStatus;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
    deletedAt: Date | null;
}