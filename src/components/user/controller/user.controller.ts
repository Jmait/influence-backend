import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { GetUserProfileDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  

}
