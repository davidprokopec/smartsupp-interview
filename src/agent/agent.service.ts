import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { schema } from '../drizzle/schema';
import { NewAgentDto } from './agent.dto';
import { DuplicateEmailError } from './utils';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}

  async getAll() {
    const agents = await this.db.select().from(schema.agent);
    return agents;
  }

  async addNew(newAgent: NewAgentDto) {
    this.logger.debug(`Creating new agent: ${JSON.stringify(newAgent)}`);

    try {
      const [agent] = await this.db
        .insert(schema.agent)
        .values({ name: newAgent.name, email: newAgent.email })
        .returning();
      return agent;
    } catch (error: any) {
      this.logger.error(`Error while creating new agent ${error.message}`);
      if (error.code === '23505') {
        throw new DuplicateEmailError();
      }
    }
  }
}
