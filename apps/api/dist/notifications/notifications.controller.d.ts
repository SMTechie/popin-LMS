import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private notifications;
    constructor(notifications: NotificationsService);
    subscribe(body: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }, user: {
        id: string;
    }): Promise<{
        id: string;
        keys: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        endpoint: string;
    }>;
    send(body: {
        userId: string;
        payload: Record<string, unknown>;
    }): Promise<{
        sent: number;
    }>;
}
