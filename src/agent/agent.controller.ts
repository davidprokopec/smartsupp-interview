import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { NewAgentDto } from './agent.dto';
import { DuplicateEmailError } from './utils';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  async getAgents() {
    const agents = await this.agentService.getAll();
    return agents;
  }

  @Put()
  async addAgent(@Body() newAgent: NewAgentDto) {
    try {
      const agent = await this.agentService.addNew(newAgent);
      return agent;
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        throw new HttpException(error.message, error.httpCode);
      }
    }
  }
}
