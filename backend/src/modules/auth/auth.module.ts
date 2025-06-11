import { Module, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { UsersModule } from '../users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET,
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '15m',
          issuer: 'lotus-api',
          header: {
            typ: 'JWT',
            alg: 'HS256',
          },
        },
      }),
    }),
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.toLowerCase().startsWith('image/')) {
          callback(
            new NotAcceptableException('Sólo se permiten imágenes'),
            false,
          );
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
      },
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, `./public/uploads/img/users`);
        },
        filename(req, file, callback) {
          const now = Date.now();
          const filename = `${now}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
