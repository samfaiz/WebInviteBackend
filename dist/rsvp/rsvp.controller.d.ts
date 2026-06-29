import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './rsvp.dto';
import type { AuthUser } from '../auth/auth.decorators';
export declare class RsvpController {
    private svc;
    constructor(svc: RsvpService);
    create(slug: string, dto: CreateRsvpDto): Promise<{
        ok: boolean;
        id: string;
    }>;
    list(user: AuthUser, id: string): Promise<{
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
