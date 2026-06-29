import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from './excel.service';
import { MailService } from '../mail/mail.service';
export declare class ExportService {
    private prisma;
    private excel;
    private mail;
    constructor(prisma: PrismaService, excel: ExcelService, mail: MailService);
    private names;
    private ownedOrThrow;
    private buildXlsx;
    download(id: string, userId: string): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        filename: string;
        title: string;
        count: number;
    }>;
    emailById(id: string, userId?: string): Promise<{
        count: number;
        filename: string;
        title: string;
        sent: boolean;
        recipient: string;
        savedTo?: string;
    }>;
}
