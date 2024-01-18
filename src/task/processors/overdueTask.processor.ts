import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('tasks')
export class OverdueTaskProcessor{
  private readonly logger = new Logger(OverdueTaskProcessor.name);



  @Process('overdue')
  async handleOverdue(job: Job) {
    this.logger.debug(`Processing job`, job);
    
  }
}
