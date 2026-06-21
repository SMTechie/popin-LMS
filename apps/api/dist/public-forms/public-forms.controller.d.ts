import { PublicFormsService } from "./public-forms.service";
export declare class PublicFormsController {
    private forms;
    constructor(forms: PublicFormsService);
    createLink(body: {
        expiresInMinutes?: number;
    }, req: any): Promise<{
        signed_url: string;
        expiry_time: Date;
    }>;
}
