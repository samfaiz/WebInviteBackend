import type { Rsvp } from '@prisma/client';
export declare class ExcelService {
    rsvpWorkbook(title: string, rsvps: Rsvp[]): Promise<Buffer>;
}
