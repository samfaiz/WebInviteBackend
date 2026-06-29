"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function toDate(value) {
    if (!value || typeof value !== 'string')
        return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}
let InvitationsService = class InvitationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    derive(content) {
        return {
            eventDate: toDate(content?.countdown?.targetDate),
            expiryDate: toDate(content?.expiry?.expiresAt),
        };
    }
    full(inv) {
        return {
            id: inv.id,
            slug: inv.slug,
            status: inv.status,
            templateId: inv.templateId,
            themeId: inv.themeId,
            motifId: inv.motifId,
            theme: JSON.parse(inv.themeJson),
            content: JSON.parse(inv.contentJson),
            ownerEmail: inv.ownerEmail,
            eventDate: inv.eventDate,
            expiryDate: inv.expiryDate,
            views: inv.views,
            publishedAt: inv.publishedAt,
            updatedAt: inv.updatedAt,
        };
    }
    names(contentJson) {
        try {
            const c = JSON.parse(contentJson);
            return `${c.couple?.partner1?.name ?? ''} & ${c.couple?.partner2?.name ?? ''}`;
        }
        catch {
            return '';
        }
    }
    async ensureOwner(userId, id) {
        const inv = await this.prisma.invitation.findUnique({ where: { id } });
        if (!inv || inv.userId !== userId)
            throw new common_1.NotFoundException('Invitation not found');
        return inv;
    }
    async create(userId, dto) {
        const { eventDate, expiryDate } = this.derive(dto.content);
        const inv = await this.prisma.invitation.create({
            data: {
                userId,
                templateId: dto.templateId,
                themeId: dto.themeId,
                motifId: dto.motifId,
                themeJson: JSON.stringify(dto.theme),
                contentJson: JSON.stringify(dto.content),
                ownerEmail: dto.ownerEmail,
                eventDate,
                expiryDate,
            },
        });
        return this.full(inv);
    }
    async update(userId, id, dto) {
        await this.ensureOwner(userId, id);
        const { eventDate, expiryDate } = this.derive(dto.content);
        const inv = await this.prisma.invitation.update({
            where: { id },
            data: {
                templateId: dto.templateId,
                themeId: dto.themeId,
                motifId: dto.motifId,
                themeJson: JSON.stringify(dto.theme),
                contentJson: JSON.stringify(dto.content),
                ownerEmail: dto.ownerEmail,
                eventDate,
                expiryDate,
            },
        });
        return this.full(inv);
    }
    async listMine(userId) {
        const rows = await this.prisma.invitation.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: { _count: { select: { rsvps: true } } },
        });
        return rows.map((r) => ({
            id: r.id,
            slug: r.slug,
            status: r.status,
            templateId: r.templateId,
            names: this.names(r.contentJson),
            eventDate: r.eventDate,
            expiryDate: r.expiryDate,
            views: r.views,
            rsvpCount: r._count.rsvps,
            updatedAt: r.updatedAt,
        }));
    }
    async getOwned(userId, id) {
        return this.full(await this.ensureOwner(userId, id));
    }
    async publish(userId, id) {
        const inv = await this.ensureOwner(userId, id);
        const content = JSON.parse(inv.contentJson);
        const base = String(content?.meta?.slug || 'invite')
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'invite';
        let slug = base;
        let n = 1;
        while (await this.prisma.invitation.findFirst({ where: { slug, NOT: { id } } })) {
            n += 1;
            slug = `${base}-${n}`;
        }
        content.meta = { ...(content.meta || {}), slug };
        const { eventDate, expiryDate } = this.derive(content);
        const updated = await this.prisma.invitation.update({
            where: { id },
            data: {
                status: 'published',
                slug,
                contentJson: JSON.stringify(content),
                publishedAt: new Date(),
                eventDate,
                expiryDate,
            },
        });
        return this.full(updated);
    }
    async unpublish(userId, id) {
        await this.ensureOwner(userId, id);
        const inv = await this.prisma.invitation.update({
            where: { id },
            data: { status: 'draft' },
        });
        return this.full(inv);
    }
    async remove(userId, id) {
        await this.ensureOwner(userId, id);
        await this.prisma.invitation.delete({ where: { id } });
        return { ok: true };
    }
    async getPublicBySlug(slug) {
        const inv = await this.prisma.invitation.findUnique({ where: { slug } });
        if (!inv || inv.status === 'draft')
            throw new common_1.NotFoundException('Invitation not found');
        if (inv.expiryDate && inv.expiryDate.getTime() < Date.now()) {
            if (inv.status !== 'expired')
                await this.prisma.invitation.update({
                    where: { id: inv.id },
                    data: { status: 'expired' },
                });
            throw new common_1.GoneException('This invitation has expired');
        }
        await this.prisma.invitation.update({
            where: { id: inv.id },
            data: { views: { increment: 1 } },
        });
        return {
            templateId: inv.templateId,
            motifId: inv.motifId,
            theme: JSON.parse(inv.themeJson),
            content: JSON.parse(inv.contentJson),
        };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map