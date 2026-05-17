import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { FoodModule } from './modules/food/food.module';
import { MealModule } from './modules/meal/meal.module';
import { PlanModule } from './modules/plan/plan.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				autoLogging: true,
				serializers: {
					req: (req) => ({
						method: req.method,
						url: req.url,
					}),
					res: (res) => ({
						statusCode: res.statusCode,
					}),
				},
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						translateTime: 'HH:MM:ss',
						ignore: 'pid,hostname',
						singleLine: true,
					},
				},
			},
		}),
		DatabaseModule,
		UserModule,
		AuthModule,
		HealthModule,
		FoodModule,
		MealModule,
		PlanModule,
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100,
			},
		]),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
