import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      : ['https://flight-booking-frontend-pi.vercel.app', 'https://flight-booking-frontend-thomas-joses-projects.vercel.app', 'http://localhost:3000', frontendUrl], // In development, allow both localhost and specified URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  };

  app.enableCors(corsOptions);
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
