import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.retrieveBearerToken(request);

    if (!token) {
      this.logger.warn('No se encontró token de autorización en la solicitud.');
      throw new UnauthorizedException('No se encontró token de autorización');
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (err) {
      this.logger.warn('Error al verificar el token:', err);
      throw new UnauthorizedException('Token de autorización inválido');
    }

    request['user'] = payload;

    return true;
  }

  private retrieveBearerToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
