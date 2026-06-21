export declare function encryptJson(value: object): {
    iv: string;
    tag: string;
    data: string;
};
export declare function decryptJson<T>(payload: {
    iv: string;
    tag: string;
    data: string;
}): T;
export declare function hashApiKey(key: string): string;
export declare function generateSecret(bytes?: number): string;
export declare function signWebhook(body: string, timestamp: string, secret: string): string;
