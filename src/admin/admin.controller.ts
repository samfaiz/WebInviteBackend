import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/auth.decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get('stats')
  stats() {
    return this.svc.stats();
  }

  @Get('invitations')
  invitations() {
    return this.svc.listInvitations();
  }

  @Get('users')
  users() {
    return this.svc.listUsers();
  }
}
