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
exports.RsvpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RsvpService = class RsvpService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(slug, dto) {
        const inv = await this.prisma.invitation.findUnique({ where: { slug } });
        if (!inv || inv.status === 'draft')
            throw new common_1.NotFoundException('Invitation not found');
        if (inv.expiryDate && inv.expiryDate.getTime() < Date.now())
            throw new common_1.GoneException('This invitation has expired');
        const r = await this.prisma.rsvp.create({
            data: {
                invitationId: inv.id,
                guestName: dto.guestName,
                attending: dto.attending,
                guests: dto.guests ?? 1,
                message: dto.message,
            },
        });
        return { ok: true, id: r.id };
    }
    async listForOwner(userId, invitationId) {
        const inv = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
        });
        if (!inv || inv.userId !== userId)
            throw new common_1.NotFoundException('Invitation not found');
        const rsvps = await this.prisma.rsvp.findMany({
            where: { invitationId },
            orderBy: { createdAt: 'desc' },
        });
        const accepted = rsvps.filter((r) => r.attending === 'accept');
        return {
            total: rsvps.length,
            accepted: accepted.length,
            declined: rsvps.length - accepted.length,
            headcount: accepted.reduce((s, r) => s + r.guests, 0),
            rsvps,
        };
    }
};
exports.RsvpService = RsvpService;
exports.RsvpService = RsvpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RsvpService);
//# sourceMappingURL=rsvp.service.js.map