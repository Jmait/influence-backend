import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  walletId: string;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @Column({
    type: 'uuid',
  })
  influencerId: string;
}
