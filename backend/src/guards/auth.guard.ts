import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.retrieveBearerToken(request);

    if (!token)
      throw new UnauthorizedException('No se encontró token de autorización');

    const payload: JwtPayload = this.jwtService.verify(token, {
      secret:
        this.configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
    });

    if (!payload)
      throw new UnauthorizedException('Token de autorización inválido');

    request['user'] = payload;

    return true;
  }

  private retrieveBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
