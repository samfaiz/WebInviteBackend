import { ConfigService } from '@nestjs/config';
export interface MailAttachment {
    filename: string;
    content: Buffer;
}
export declare class MailService {
    private config;
    private readonly logger;
    private transporter;
    private readonly live;
    constructor(config: ConfigService);
    send(opts: {
        to: string;
        subject: string;
        text: string;
        attachments?: MailAttachment[];
    }): Promise<{
        sent: boolean;
        recipient: string;
        savedTo?: string;
    }>;
}
