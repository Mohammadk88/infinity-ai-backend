import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import helmet from 'helmet';
import * as Express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure CORS first
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4040',
      `http://localhost:${process.env.PORT ?? 3000}`,
    ],
    credentials: true,
  });

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // Static assets
  app.useStaticAssets(
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '..', 'uploads')
      : join(__dirname, 'uploads'),
    {
      prefix: '/public/',
    },
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Infinity AI System')
    .setDescription('Full API documentation for our marketing system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }

  // CSRF protection (disabled for API endpoints in development)
  if (process.env.NODE_ENV === 'production') {
    app.use(
      csurf({
        cookie: {
          httpOnly: false,
          secure: true,
        },
      }),
    );

    app.use(
      (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction,
      ) => {
        res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
        next();
      },
    );
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}
bootstrap().catch((err) => console.error('Failed to start application:', err));
