import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(password, 10);

    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'member' },
    });

    if (!defaultRole) {
        throw new Error('Default role "member" not found');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        roleId: defaultRole?.id,
      },
    });

    const token = this.jwtService.sign({ sub: user.id });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: { role: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, role: user.role.name });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    };
  }
}
