export declare class WebhookProcessor {
    static handle(job: {
        data: {
            deliveryId: string;
        };
    }): Promise<void>;
}
