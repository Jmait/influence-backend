import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserType } from 'src/components/auth/dto/auth.dto';
import { SKIP_PROFILE_CHECK } from '../decorator/decorators';

export class ProfileSetupCheckerInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return next.handle();
    }

    const skip = this.reflector.get<boolean>(
      SKIP_PROFILE_CHECK,
      context.getHandler(),
    );

    if (skip) {
      return next.handle();
    }

    const user = request.user;
    if (user.type == UserType.INFLUENCER && user.influencerProfileId == null) {
      throw new BadRequestException('Please setup your influencer profile');
    } else {
      return next.handle();
    }
  }
}
