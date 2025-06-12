import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  if (!existsSync('./public/uploads/img/users/'))
    mkdirSync('./public/uploads/img/users/', { recursive: true });

  if (!existsSync('./public/uploads/img/posts/'))
    mkdirSync('./public/uploads/img/posts/', { recursive: true });

  const app = await NestFactory.create(AppModule);

  const validationPipe: ValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
