import { AdminService } from './admin.service';
export declare class AdminController {
    private svc;
    constructor(svc: AdminService);
    stats(): Promise<{
        users: number;
        invitations: number;
        published: number;
        drafts: number;
        rsvps: number;
        totalViews: number;
    }>;
    invitations(): Promise<{
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
    users(): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        invitations: number;
        createdAt: Date;
    }[]>;
}
