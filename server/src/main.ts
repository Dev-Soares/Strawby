import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import basicAuth from 'express-basic-auth';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PinoLogger } from 'nestjs-pino';

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

function validateRequiredEnvs(): void {
  requireEnv('CORS_ORIGIN');
  requireEnv('JWT_SECRET');
  requireEnv('JWT_REFRESH_SECRET');
  requireEnv('DATABASE_URL');
}

function parseOrigins(raw: string | undefined): string | string[] | undefined {
  if (!raw) return undefined;
  const list = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return list.length > 1 ? list : list[0];
}

async function bootstrap() {
  validateRequiredEnvs();

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const logger = await app.resolve(PinoLogger);
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.enableCors({
    origin: parseOrigins(requireEnv('CORS_ORIGIN')),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Strawby API')
      .setDescription('Strawby API documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    const swaggerUser = process.env.SWAGGER_USER;
    const swaggerPassword = process.env.SWAGGER_PASSWORD;

    if (swaggerUser && swaggerPassword) {
      app.use(
        '/api-docs',
        basicAuth({
          users: { [swaggerUser]: swaggerPassword },
          challenge: true,
        }),
      );
    }

    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(PORT);

  Logger.log(`API running on port ${PORT}`);
}
bootstrap();
