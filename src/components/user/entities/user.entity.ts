import { Exclude } from 'class-transformer';
import { InfluencerProfile } from 'src/components/influencers/entities/influencer.entity';
import { Order } from 'src/components/orders/entities/order.entity';
import { Review } from 'src/components/reviews/entities/review.entity';
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, type: 'text' })
  profileImage: string;

  @Column({ nullable: true })
  type: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(
    () => InfluencerProfile,
    (influencerProfile) => influencerProfile.user,
  )
  influencerProfile: InfluencerProfile;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
