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

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Fullstack Template API')
		.setDescription('Fullstack Template API documentation')
		.setVersion('0.1')
		.addTag('template')
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);

	app.use(
		'/api-docs',
		basicAuth({
			users: {
				[process.env.SWAGGER_USER as string]: process.env.SWAGGER_PASSWORD as string,
			},
			challenge: true,
		}),
	);

	SwaggerModule.setup('api-docs', app, document);

	app.enableCors({
		origin: process.env.CORS_ORIGIN,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Accept',
		credentials: true,
	});

	const logger = await app.resolve(PinoLogger);

	app.useGlobalFilters(new AllExceptionsFilter(logger));

	app.use(helmet());

	app.use(cookieParser());

	await app.listen(PORT);

	Logger.log(`API running on port ${PORT}`);
}
bootstrap();
