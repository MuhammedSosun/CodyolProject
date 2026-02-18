import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:4000',
    credentials: true,
  });

  // ✅ uploads klasörü yoksa oluştur (prod/dev güvenli)
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  // ✅ uploads klasörünü /uploads altında statik servis et
  // ⚠️ prefix sonunda "/" OLMASIN
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads',
  });

  // ✅ Request logger
  app.use((req, res, next) => {
    console.log('➡️ INCOMING:', req.method, req.url);
    console.log('   auth:', req.headers.authorization);
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Codyol CRM API')
    .setDescription('CRM Backend API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Sadece JWT token gir, Bearer otomatik eklenir',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3050);
}

bootstrap();
