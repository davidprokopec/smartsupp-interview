import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';
import { TaskController } from './task.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  providers: [TaskService, ...drizzleProvider],
  controllers: [TaskController],
})
export class TaskModule {}
