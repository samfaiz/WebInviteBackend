import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    stats(): Promise<{
        users: number;
        invitations: number;
        published: number;
        drafts: number;
        rsvps: number;
        totalViews: number;
    }>;
    listInvitations(): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        owner: string;
        views: number;
        rsvpCount: number;
        eventDate: Date | null;
        createdAt: Date;
    }[]>;
    listUsers(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        invitations: number;
        createdAt: Date;
    }[]>;
}
