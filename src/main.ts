import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import helmet from 'helmet';
import * as Express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Infinity AI System')
    .setDescription('Full API documentation for our marketing system')
    .setVersion('1.0')
    .addBearerAuth() // عشان توثيق JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document); // /docs بتفتح منه التوثيق
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // يشيل أي حقول مش معرفة في DTO
      forbidNonWhitelisted: false,
      transform: true, // يحوّل البيانات تلقائيًا للـ DTOs
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000', // رابط الفرونت
    credentials: true, // مهم لدعم الكوكيز
  });
  app.use(cookieParser()); // لازم قبله
  app.use(
    csurf({
      cookie: {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );
  app.use(csurf({ cookie: true }));

  app.use(
    (
      req: Express.Request,
      res: Express.Response,
      next: Express.NextFunction,
    ) => {
      res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false }); // يجب أن يكون httpOnly: false لتستطيع قراءته بالفرونت
      next();
    },
  );
  app.use(helmet()); // مهم جدًا لحماية الـ Headers
  app.enableCors({
    origin: [`http://localhost:${process.env.PORT ?? 4040}`], // رابط الـ Frontend
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4040);
}
bootstrap().catch((err) => console.error('Failed to start application:', err));
