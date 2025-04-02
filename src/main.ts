import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Failed to start application:', err));
