import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentModule } from './agent/agent.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { TaskModule } from './task/task.module';
import { BullModule } from '@nestjs/bull';
import env from './utils/env';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AgentModule,
    DrizzleModule,
    TaskModule,

    BullModule.forRoot({
      redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      },
    }),

    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
