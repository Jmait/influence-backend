import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('influencer_services')
export class InfluencerService {
  @PrimaryGeneratedColumn('uuid')
  serviceId: string;

  @Column()
  title: string;

  @Column()
  channel: string;

  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  description: string;
}
