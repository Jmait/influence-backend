import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {
  OrderItem,
  OrderStatus,
  TransactionStatus,
} from './order-items.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @Column({ type: 'varchar', default: TransactionStatus.PENDING })
  paymentStatus: string;

  @Column({ type: 'varchar', default: OrderStatus.PENDING })
  status: string;

  @Column('decimal')
  totalPrice: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
