import { PrismaService } from '../prisma/prisma.service';
import { CreateRsvpDto } from './rsvp.dto';
export declare class RsvpService {
    private prisma;
    constructor(prisma: PrismaService);
    create(slug: string, dto: CreateRsvpDto): Promise<{
        ok: boolean;
        id: string;
    }>;
    listForOwner(userId: string, invitationId: string): Promise<{
        total: number;
        accepted: number;
        declined: number;
        headcount: number;
        rsvps: {
            id: string;
            createdAt: Date;
            guestName: string;
            attending: string;
            guests: number;
            message: string | null;
            invitationId: string;
        }[];
    }>;
}
