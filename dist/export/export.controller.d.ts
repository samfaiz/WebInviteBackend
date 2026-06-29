import type { Response } from 'express';
import { ExportService } from './export.service';
import type { AuthUser } from '../auth/auth.decorators';
export declare class ExportController {
    private svc;
    constructor(svc: ExportService);
    download(user: AuthUser, id: string, res: Response): Promise<void>;
    send(user: AuthUser, id: string): Promise<{
        count: number;
        filename: string;
        title: string;
        sent: boolean;
        recipient: string;
        savedTo?: string;
    }>;
}
