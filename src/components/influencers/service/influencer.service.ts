import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUserPublicrofileDto } from 'src/components/user/dto/user.dto';
import { UserService } from 'src/components/user/service/user.service';

@Injectable()
export class InfluencerService {
  constructor(private readonly userService: UserService) {}

  async getInfluencerProfile(dto: GetUserPublicrofileDto) {
    try {
      return await this.userService.getAllInfluencers(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getInfluencerPublicProfile(userId: string) {
    try {
      return await this.userService.getInflucerPublicProfile(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
