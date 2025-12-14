import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import {
  OrderItem,
  OrderStatus,
  TransactionStatus,
} from './order-items.entity';
import { ShippingAddress } from 'src/components/shipping/entities/shipping.entity';

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

  @Column({ type: 'uuid', nullable: true })
  shippingAddressId: string;

  @ManyToOne(
    () => ShippingAddress,
    (shippingAddress) => shippingAddress.orders,
    {},
  )
  shippingAddress: ShippingAddress;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
