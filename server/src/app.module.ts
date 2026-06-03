import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { FoodModule } from './modules/food/food.module';
import { PrivateFoodModule } from './modules/private-food/private-food.module';
import { MealModule } from './modules/meal/meal.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { PlanModule } from './modules/plan/plan.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { DailyScoreModule } from './modules/daily-score/daily-score.module';
import { NutritionistModule } from './modules/nutritionist/nutritionist.module';
import { ConnectionRequestModule } from './modules/connection-request/connection-request.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './modules/jobs/jobs.module';
import { PatientModule } from './modules/patient/patient.module';

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
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100,
			},
		]),
		DatabaseModule,
		UserModule,
		AuthModule,
		HealthModule,
		FoodModule,
		PrivateFoodModule,
		MealModule,
		RecipeModule,
		PlanModule,
		DailyScoreModule,
		NutritionistModule,
		ConnectionRequestModule,
		PatientModule,
		JobsModule,
		ScheduleModule.forRoot(),		
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
