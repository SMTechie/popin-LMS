import { Queue } from "bullmq";
export declare class QueueService {
    private connection;
    automationQueue: Queue;
    emailIngestionQueue: Queue;
    webhookQueue: Queue;
    constructor();
}
