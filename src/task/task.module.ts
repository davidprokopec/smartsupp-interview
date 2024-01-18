import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { TaskController } from './task.controller';
import { BullModule } from '@nestjs/bull';
import { OverdueTaskProcessor } from './processors/overdueTask.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  providers: [TaskService, ...drizzleProvider, OverdueTaskProcessor],
  controllers: [TaskController],
})
export class TaskModule {}
