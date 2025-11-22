import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  rating: number;

  @Column({ type: 'uuid' })
  userId: string;

  // @ManyToOne(() => User, user => user.reviews, { eager: true })
  // user: User;

  // @ManyToOne(() => Product, product => product.reviews, { eager: true })
  // product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
