import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { InfluencerProfile } from '../influencers/entities/influencer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, InfluencerProfile])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
