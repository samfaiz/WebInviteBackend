import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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
}
