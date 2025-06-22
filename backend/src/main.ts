import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const publicPath = join(__dirname, '..', 'public');
  const uploadsPath = join(publicPath, 'uploads', 'img');
  const userUploadsPath = join(uploadsPath, 'users');
  const postsUploadPath = join(uploadsPath, 'posts');

  if (!existsSync(userUploadsPath))
    mkdirSync(userUploadsPath, { recursive: true });

  if (!existsSync(postsUploadPath))
    mkdirSync(postsUploadPath, { recursive: true });

  const app = await NestFactory.create(AppModule);

  const validationPipe: ValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Error durante el bootstrapping de la aplicación:', error);
  process.exit(1);
});
