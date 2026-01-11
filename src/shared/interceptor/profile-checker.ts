import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserType } from 'src/components/auth/dto/auth.dto';

export class ProfileSetupCheckerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
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
