import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { MainSeeder } from './seed/seeds';
import { DataSource } from 'typeorm';
import { PaginationInterceptor } from './shared/interceptors/pagination.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );
  app.useGlobalInterceptors(new PaginationInterceptor());
  const dataSource = app.get(DataSource);

  // const seeder = new MainSeeder(dataSource);
  // await seeder.run();

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
