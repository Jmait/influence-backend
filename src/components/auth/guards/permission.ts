import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProfileRequestOptions } from 'src/shared/interface/shared.interface';

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  INFLUENCER = 'INFLUENCER',
}

export const ROLES_KEY = 'user-roles';
export const UserRoles = (...roles: UserType[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredPermissions = this.reflector.getAllAndOverride<UserType[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const request = context.switchToHttp().getRequest();

      if (!request.user) {
        /***This means the route is not protected */
        return true;
      }

      const user = request.user as ProfileRequestOptions;
      const permissions = user.user;

      const userPermissions = new Set(permissions.map((rp) => rp));

      if (!requiredPermissions) return true;

      const hasAll = requiredPermissions.every((p) => userPermissions.has(p));

      if (!hasAll) {
        throw new ForbiddenException(
          'You need to request permissions to perform this action',
        );
      }

      return hasAll;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
