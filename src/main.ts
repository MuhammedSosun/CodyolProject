import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const isProd = process.env.NODE_ENV === 'production';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🔐 Eğer Nginx / LoadBalancer arkasında çalışacaksan
  if (isProd) {
    app.set('trust proxy', 1);
  }

  app.use(cookieParser());

  // 🌍 CORS (Dev + Prod)
  app.enableCors({
    origin: isProd
      ? [process.env.FRONTEND_URL!] // .env.production içine koyacağız
      : ['http://localhost:4000'],
    credentials: true,
  });

  // 📁 uploads klasörü oluştur
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  // 🛡 Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 📚 Swagger sadece development'ta açık
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Codyol CRM API')
      .setDescription('CRM Backend API Documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(3050);
}

bootstrap();
