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
var ExpiryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiryService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const export_service_1 = require("../export/export.service");
let ExpiryService = ExpiryService_1 = class ExpiryService {
    prisma;
    exportService;
    logger = new common_1.Logger(ExpiryService_1.name);
    constructor(prisma, exportService) {
        this.prisma = prisma;
        this.exportService = exportService;
    }
    async expireOldInvitations() {
        const due = await this.prisma.invitation.findMany({
            where: { status: 'published', expiryDate: { lt: new Date() } },
        });
        for (const inv of due) {
            try {
                await this.exportService.emailById(inv.id);
            }
            catch (e) {
                this.logger.error(`RSVP export email failed for ${inv.id}: ${e.message}`);
            }
            await this.prisma.invitation.update({
                where: { id: inv.id },
                data: { status: 'expired' },
            });
        }
        if (due.length) {
            this.logger.log(`Expired ${due.length} invitation(s); emailed RSVP list to owners`);
        }
    }
};
exports.ExpiryService = ExpiryService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpiryService.prototype, "expireOldInvitations", null);
exports.ExpiryService = ExpiryService = ExpiryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        export_service_1.ExportService])
], ExpiryService);
//# sourceMappingURL=expiry.service.js.map