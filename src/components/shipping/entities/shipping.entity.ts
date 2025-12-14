import { Order } from 'src/components/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shipping_address')
export class ShippingAddress {
  @PrimaryGeneratedColumn('uuid')
  addressId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar' })
  postalCode: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  addressLine1: string;

  @Column({ type: 'boolean', default: false })
  isBillingAddress: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.shippingAddress)
  orders: Order[];

  @Column({ type: 'varchar', nullable: true })
  additionalAddress: string;
}
