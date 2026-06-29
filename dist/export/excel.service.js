"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const ExcelJS = __importStar(require("exceljs"));
let ExcelService = class ExcelService {
    async rsvpWorkbook(title, rsvps) {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'Eternal';
        const ws = wb.addWorksheet('RSVPs');
        ws.columns = [
            { header: 'Guest Name', key: 'guestName', width: 30 },
            { header: 'Response', key: 'attending', width: 14 },
            { header: 'Guests', key: 'guests', width: 10 },
            { header: 'Message', key: 'message', width: 45 },
            { header: 'Responded At', key: 'createdAt', width: 24 },
        ];
        ws.getRow(1).font = { bold: true };
        ws.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2B3A67' },
        };
        ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        let accepting = 0;
        let headcount = 0;
        for (const r of rsvps) {
            if (r.attending === 'accept') {
                accepting += 1;
                headcount += r.guests;
            }
            ws.addRow({
                guestName: r.guestName,
                attending: r.attending === 'accept' ? 'Accepting' : 'Declining',
                guests: r.guests,
                message: r.message || '',
                createdAt: new Date(r.createdAt).toLocaleString(),
            });
        }
        ws.addRow({});
        const summary = ws.addRow({
            guestName: `${title}`,
            attending: `${accepting} accepting`,
            guests: headcount,
            message: `${rsvps.length - accepting} declining`,
        });
        summary.font = { italic: true };
        const buf = await wb.xlsx.writeBuffer();
        return Buffer.from(buf);
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)()
], ExcelService);
//# sourceMappingURL=excel.service.js.map