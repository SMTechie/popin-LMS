import { EmailService } from "./email.service";
export declare class EmailController {
    private email;
    constructor(email: EmailService);
    listRules(): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        boardId: string;
        matchType: string;
        matchValue: string;
    }[]>;
    createRule(body: {
        name: string;
        boardId: string;
        matchType: string;
        matchValue: string;
    }): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        boardId: string;
        matchType: string;
        matchValue: string;
    }>;
}
