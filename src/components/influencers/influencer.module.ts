import { Module } from '@nestjs/common';
import { UserService } from '../user/service/user.service';
import { InfluencerController } from './controller/influencer.controller';
import { InfluencerService } from './service/influencer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerProfile } from './entities/influencer.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminInfluencerManagementController } from './controller/admin.influencer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InfluencerProfile, User]), AuthModule],
  controllers: [InfluencerController, AdminInfluencerManagementController],
  providers: [InfluencerService, UserService],
})
export class InfluencerModule {}
