import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('influencer_service_categories')
export class InfluncerServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  serviceCategoryId: string;

  type: string;

  name: string;
}
