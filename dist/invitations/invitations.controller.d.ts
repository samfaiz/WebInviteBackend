import { InvitationsService } from './invitations.service';
import { SaveInvitationDto } from './invitations.dto';
import type { AuthUser } from '../auth/auth.decorators';
export declare class InvitationsController {
    private svc;
    constructor(svc: InvitationsService);
    create(user: AuthUser, dto: SaveInvitationDto): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        themeId: string;
        motifId: string;
        theme: any;
        content: any;
        ownerEmail: string | null;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    list(user: AuthUser): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        names: string;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        rsvpCount: number;
        updatedAt: Date;
    }[]>;
    get(user: AuthUser, id: string): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        themeId: string;
        motifId: string;
        theme: any;
        content: any;
        ownerEmail: string | null;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    update(user: AuthUser, id: string, dto: SaveInvitationDto): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        themeId: string;
        motifId: string;
        theme: any;
        content: any;
        ownerEmail: string | null;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    publish(user: AuthUser, id: string): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        themeId: string;
        motifId: string;
        theme: any;
        content: any;
        ownerEmail: string | null;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    unpublish(user: AuthUser, id: string): Promise<{
        id: string;
        slug: string | null;
        status: string;
        templateId: string;
        themeId: string;
        motifId: string;
        theme: any;
        content: any;
        ownerEmail: string | null;
        eventDate: Date | null;
        expiryDate: Date | null;
        views: number;
        publishedAt: Date | null;
        updatedAt: Date;
    }>;
    remove(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    publicGet(slug: string): Promise<{
        templateId: string;
        motifId: string;
        theme: any;
        content: any;
    }>;
}
