import { NestFactory, ModuleRef } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { PaginationInterceptor } from './shared/interceptors/pagination.interceptor';
import { MainSeeder } from './seed/seeds';
import { ProfileSetupCheckerInterceptor } from './shared/interceptor/profile-checker';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new PaginationInterceptor());
  app.useGlobalInterceptors(
    new ProfileSetupCheckerInterceptor(app.get(ModuleRef)),
  );
  const dataSource = app.get(DataSource);

  const seeder = new MainSeeder(dataSource);
  await seeder.run();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Influence API')
    .setDescription('API documentation for Influence Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
