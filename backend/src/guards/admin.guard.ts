import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as JwtPayload;

    if (user.profile !== 'admin')
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción.',
      );

    return true;
  }
}
