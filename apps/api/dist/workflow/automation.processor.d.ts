export declare class AutomationProcessor {
    static handle(job: {
        data: {
            type: string;
            payload: Record<string, unknown>;
        };
    }): Promise<void>;
}
