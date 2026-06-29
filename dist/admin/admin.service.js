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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async stats() {
        const [users, invitations, published, rsvps, views] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.invitation.count(),
            this.prisma.invitation.count({ where: { status: 'published' } }),
            this.prisma.rsvp.count(),
            this.prisma.invitation.aggregate({ _sum: { views: true } }),
        ]);
        return {
            users,
            invitations,
            published,
            drafts: invitations - published,
            rsvps,
            totalViews: views._sum.views ?? 0,
        };
    }
    async listInvitations() {
        const rows = await this.prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { email: true, name: true } },
                _count: { select: { rsvps: true } },
            },
        });
        return rows.map((r) => ({
            id: r.id,
            slug: r.slug,
            status: r.status,
            templateId: r.templateId,
            owner: r.user.email,
            views: r.views,
            rsvpCount: r._count.rsvps,
            eventDate: r.eventDate,
            createdAt: r.createdAt,
        }));
    }
    async listUsers() {
        const rows = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { invitations: true } } },
        });
        return rows.map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            invitations: u._count.invitations,
            createdAt: u.createdAt,
        }));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map