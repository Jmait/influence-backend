import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('influencer_service_categories')
export class InfluncerServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  serviceCategoryId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
