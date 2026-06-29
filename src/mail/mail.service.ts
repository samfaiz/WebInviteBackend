import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface MailAttachment {
  filename: string;
  content: Buffer;
}

/**
 * Sends email via SMTP when configured (SMTP_HOST/USER/PASS in .env), otherwise
 * runs in DEV mode: nothing is sent over the network — the message is logged and
 * any attachment is written to backend/exports/ so you can open exactly what
 * would have been emailed. Add SMTP creds (Gmail/SendGrid/etc.) to go live.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly live: boolean;

  constructor(private config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    if (host) {
      const port = Number(config.get('SMTP_PORT') || 587);
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: config.get<string>('SMTP_USER'),
          pass: config.get<string>('SMTP_PASS'),
        },
      });
      this.live = true;
    } else {
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
      this.live = false;
    }
  }

  async send(opts: {
    to: string;
    subject: string;
    text: string;
    attachments?: MailAttachment[];
  }): Promise<{ sent: boolean; recipient: string; savedTo?: string }> {
    const from =
      this.config.get<string>('MAIL_FROM') || 'Eternal <no-reply@eternal.local>';

    let savedTo: string | undefined;
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
    } else {
      this.logger.warn(
        `[DEV] Email NOT sent (no SMTP configured). To: ${opts.to} · "${opts.subject}"` +
          (savedTo ? ` · attachment saved to ${savedTo}` : ''),
      );
    }

    return { sent: this.live, recipient: opts.to, savedTo };
  }
}
