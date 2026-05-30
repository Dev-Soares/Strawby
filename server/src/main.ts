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

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
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
    origin: parseOrigins(process.env.CORS_ORIGIN),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Strawby API')
    .setDescription('Strawby API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.use(
    '/api-docs',
    basicAuth({
      users: {
        [requireEnv('SWAGGER_USER')]: requireEnv('SWAGGER_PASSWORD'),
      },
      challenge: true,
    }),
  );

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);

  Logger.log(`API running on port ${PORT}`);
}
bootstrap();
