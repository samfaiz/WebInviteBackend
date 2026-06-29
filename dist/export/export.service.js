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
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const excel_service_1 = require("./excel.service");
const mail_service_1 = require("../mail/mail.service");
let ExportService = class ExportService {
    prisma;
    excel;
    mail;
    constructor(prisma, excel, mail) {
        this.prisma = prisma;
        this.excel = excel;
        this.mail = mail;
    }
    names(json) {
        try {
            const c = JSON.parse(json);
            return (`${c.couple?.partner1?.name ?? ''} & ${c.couple?.partner2?.name ?? ''}`.trim() ||
                'Wedding');
        }
        catch {
            return 'Wedding';
        }
    }
    async ownedOrThrow(id, userId) {
        const inv = await this.prisma.invitation.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!inv || inv.userId !== userId)
            throw new common_1.NotFoundException('Invitation not found');
        return inv;
    }
    async buildXlsx(inv) {
        const rsvps = await this.prisma.rsvp.findMany({
            where: { invitationId: inv.id },
            orderBy: { createdAt: 'asc' },
        });
        const title = this.names(inv.contentJson);
        const buffer = await this.excel.rsvpWorkbook(title, rsvps);
        const filename = `${inv.slug || inv.id}-rsvps.xlsx`;
        return { buffer, filename, title, count: rsvps.length };
    }
    async download(id, userId) {
        const inv = await this.ownedOrThrow(id, userId);
        return this.buildXlsx(inv);
    }
    async emailById(id, userId) {
        const inv = userId
            ? await this.ownedOrThrow(id, userId)
            : await this.prisma.invitation.findUnique({
                where: { id },
                include: { user: true },
            });
        if (!inv)
            throw new common_1.NotFoundException('Invitation not found');
        const recipient = inv.ownerEmail || inv.user?.email;
        if (!recipient)
            throw new common_1.BadRequestException('No recipient email set for this invitation');
        const { buffer, filename, title, count } = await this.buildXlsx(inv);
        const result = await this.mail.send({
            to: recipient,
            subject: `RSVP attendee list — ${title}`,
            text: `Here is the RSVP attendee list for ${title} (${count} response${count === 1 ? '' : 's'}). The full list is attached as an Excel file.`,
            attachments: [{ filename, content: buffer }],
        });
        return { ...result, count, filename, title };
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        excel_service_1.ExcelService,
        mail_service_1.MailService])
], ExportService);
//# sourceMappingURL=export.service.js.map