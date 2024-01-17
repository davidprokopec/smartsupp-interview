import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { drizzleProvider } from '../drizzle/drizzle.provider';

@Module({
  providers: [AgentService, ...drizzleProvider],
  controllers: [AgentController],
})
export class AgentModule {}
