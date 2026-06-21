export declare class EmailIngestionProcessor {
    static handle(): Promise<void>;
    private static pollImap;
    private static formatAddresses;
    private static matchRule;
    private static extractCardId;
}
