import { PrismaService } from '../prisma/prisma.service';
import { ExportService } from '../export/export.service';
export declare class ExpiryService {
    private prisma;
    private exportService;
    private readonly logger;
    constructor(prisma: PrismaService, exportService: ExportService);
    expireOldInvitations(): Promise<void>;
}
