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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    transporter;
    live;
    constructor(config) {
        this.config = config;
        const host = config.get('SMTP_HOST');
        if (host) {
            const port = Number(config.get('SMTP_PORT') || 587);
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: {
                    user: config.get('SMTP_USER'),
                    pass: config.get('SMTP_PASS'),
                },
            });
            this.live = true;
        }
        else {
            this.transporter = nodemailer.createTransport({ jsonTransport: true });
            this.live = false;
        }
    }
    async send(opts) {
        const from = this.config.get('MAIL_FROM') || 'Eternal <no-reply@eternal.local>';
        let savedTo;
        if (!this.live && opts.attachments?.length) {
            const dir = path.join(process.cwd(), 'exports');
            fs.mkdirSync(dir, { recursive: true });
            for (const a of opts.attachments) {
                const p = path.join(dir, a.filename);
                fs.writeFileSync(p, a.content);
                savedTo = p;
            }
        }
        await this.transporter.sendMail({ from, ...opts });
        if (this.live) {
            this.logger.log(`Email sent to ${opts.to}: "${opts.subject}"`);
        }
        else {
            this.logger.warn(`[DEV] Email NOT sent (no SMTP configured). To: ${opts.to} · "${opts.subject}"` +
                (savedTo ? ` · attachment saved to ${savedTo}` : ''));
        }
        return { sent: this.live, recipient: opts.to, savedTo };
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map