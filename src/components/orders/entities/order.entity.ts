import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  OrderItem,
  OrderStatus,
  TransactionStatus,
} from './order-items.entity';
import { ShippingAddress } from '../../../components/shipping/entities/shipping.entity';
import { User } from '../../../components/user/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @Column({ type: 'varchar', nullable: true })
  reference: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @Column({ type: 'varchar', default: TransactionStatus.PENDING })
  paymentStatus: string;

  @Column({ type: 'varchar', default: OrderStatus.PENDING })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column('decimal')
  totalPrice: number;

  @Column({ type: 'uuid', nullable: true })
  shippingAddressId: string;

  @ManyToOne(
    () => ShippingAddress,
    (shippingAddress) => shippingAddress.orders,
    {},
  )
  shippingAddress: ShippingAddress;

  @ManyToOne(() => User, (user) => user.orders, {})
  @JoinColumn({ name: 'userId' })
  customer: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
