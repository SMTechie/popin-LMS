export declare class HealthController {
    health(): {
        status: string;
        ts: string;
    };
    metrics(): {
        uptime: number;
        memory: NodeJS.MemoryUsage;
    };
}
