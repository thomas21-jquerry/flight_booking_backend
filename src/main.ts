import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'flight-booking-frontend-pi.vercel.app');

  // CORS configuration based on environment
  const corsOptions = {
    origin: nodeEnv === 'production' 
      ? frontendUrl // In production, only allow the specified frontend URL
      : ['https://flight-booking-frontend-pi.vercel.app', 'https://flight-booking-frontend-thomas-joses-projects.vercel.app', "https://flight-booking-frontend-k9npuh0gg-thomas-joses-projects.vercel.app",'http://localhost:3000', frontendUrl], // In development, allow both localhost and specified URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Enable Global Validation
  app.useGlobalPipes(new ValidationPipe());

  // 🔹 Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Flight Booking API') // Title of API
    .setDescription('API documentation for the Flight Booking system') // Description
    .setVersion('1.0') // API version
    .addBearerAuth() // JWT Authentication Support
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document); // API docs route

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 Swagger API Docs: http://localhost:${port}/api/docs`);
}
bootstrap();
