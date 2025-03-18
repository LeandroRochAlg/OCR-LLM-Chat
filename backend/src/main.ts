import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove properties not defined in DTOs
    transform: true, // Transform payloads to the defined types
    forbidNonWhitelisted: true, // Reject requests with unexpected properties
  }));
  
  // Enable CORS with specific configurations
  app.enableCors({
    origin: process.env.ORIGIN_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global prefix for all API routes
  app.setGlobalPrefix('api');
  
  // Increase the maximum request payload size
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();