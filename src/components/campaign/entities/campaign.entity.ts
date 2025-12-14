import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('influencer_services')
export class Campaigns {
  @PrimaryGeneratedColumn('uuid')
  serviceId: string;

  @Column({ type: 'uuid' })
  serviceCategoryId: string;

  @Column({ type: 'uuid' })
  influencerId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int', default: 1 })
  duration: number;

  @Column({ type: 'int', default: 1 })
  numberOfDeliverables: number;

  @Column({ type: 'int', default: 0 })
  numberOfRevisions: number;

  @Column()
  price: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  description: string;
}
