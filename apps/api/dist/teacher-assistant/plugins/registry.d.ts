import { SubjectMarkingPlugin } from "./types";
export declare class SubjectPluginRegistry {
    private plugins;
    register(plugin: SubjectMarkingPlugin): void;
    resolve(subject: string, questionType: string): SubjectMarkingPlugin | undefined;
    describe(): {
        key: string;
        subjects: string[];
    }[];
}
