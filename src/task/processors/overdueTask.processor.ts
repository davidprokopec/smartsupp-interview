import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor("tasks")
export class OverdueTaskProcessor {
	private readonly logger = new Logger(OverdueTaskProcessor.name);

	@Process("overdue")
	async handleOverdue(job: Job) {
		this.logger.debug(`Processing job ${job.id}`);

		this.logger.log(
			`Task id: ${job.data.id}, taskName: ${job.data.name}, agentName: ${job.data.agentName} - was not finished.`,
		);
		await job.moveToCompleted();
	}
}
