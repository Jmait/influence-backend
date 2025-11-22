import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { InfluencerController } from './controller/influencer.controller';
import { InfluencerService } from './service/influencer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerProfile } from './entities/influencer.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InfluencerProfile, User])],
  controllers: [InfluencerController],
  providers: [InfluencerService, UserService],
})
export class InfluencerModule {}
