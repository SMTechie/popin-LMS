import { SettingsService } from "./settings.service";
export declare class SettingsController {
    private settings;
    constructor(settings: SettingsService);
    getAll(): Promise<{
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    get(key: string): Promise<{
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
    set(key: string, value: Record<string, unknown>, req: any): Promise<{
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
