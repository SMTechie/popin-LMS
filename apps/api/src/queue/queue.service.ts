import { Injectable } from "@nestjs/common";
import { Queue, Worker, ConnectionOptions } from "bullmq";
import { AutomationProcessor } from "../workflow/automation.processor";
import { EmailIngestionProcessor } from "../email/email-ingestion.processor";
import { WebhookProcessor } from "../webhooks/webhook.processor";
import { getRedisConnection } from "./redis";

@Injectable()
export class QueueService {
  private connection: ConnectionOptions;
  public automationQueue: Queue;
  public emailIngestionQueue: Queue;
  public webhookQueue: Queue;

  constructor() {
    this.connection = getRedisConnection();

    this.automationQueue = new Queue("automation", { connection: this.connection });
    this.emailIngestionQueue = new Queue("email-ingestion", { connection: this.connection });
    this.webhookQueue = new Queue("webhook-delivery", { connection: this.connection });

    // Start workers in API process for local dev. In production, use a separate worker process.
    new Worker("automation", AutomationProcessor.handle, { connection: this.connection });

    new Worker("email-ingestion", EmailIngestionProcessor.handle, { connection: this.connection });

    new Worker("webhook-delivery", WebhookProcessor.handle, { connection: this.connection });
  }
}
