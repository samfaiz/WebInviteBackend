import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { InvitationsModule } from './invitations/invitations.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { ExportModule } from './export/export.module';
import { ExpiryService } from './tasks/expiry.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    InvitationsModule,
    RsvpModule,
    AdminModule,
    MailModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [ExpiryService],
})
export class AppModule {}
