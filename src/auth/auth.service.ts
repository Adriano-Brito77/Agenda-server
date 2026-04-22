//import { SESClient } from '@aws-sdk/client-snpm install @aws-sdk/client-seses';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';

import 'dotenv/config';

import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login({ cpfemail, password, role }: CreateAuthDto) {
    let rolePermission: ('USER' | 'BUSINESS' | 'PROFESSIONAL')[] = ['USER'];
    let company: string[] = [];
    /* valida se o CPF ou email existe */
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ cpf: cpfemail }, { email: cpfemail }],
      },
    });

    if (!userExists) {
      throw new UnauthorizedException('CPF/e-mail ou senha inválidos');
    }

    const companyUser = await this.prisma.companyUser.findFirst({
      where: {
        user_id: userExists.id,
      },
    });

    companyUser ? rolePermission.push('PROFESSIONAL') : null;

    if (role === 'PROFESSIONAL' && !companyUser) {
      throw new UnauthorizedException('Usuário não é um profissional');
    }

    const busynessUser = await this.prisma.company.findMany({
      where: {
        creator_id: userExists.id,
      },
    });

    busynessUser.length > 0
      ? company.push(...busynessUser.map((c) => c.id))
      : null;
    busynessUser ? rolePermission.push('BUSINESS') : null;

    if (role === 'BUSINESS' && !busynessUser) {
      throw new UnauthorizedException('Usuário não é empresarial');
    }

    /* valida se a senha está correta */
    const passwordMatch = await compare(password, userExists.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('CPF/e-mail ou senha inválidos');
    }

    /* gera o token JWT */
    const token = this.jwtService.sign({
      sub: userExists.id,
      email: userExists.email,
    });

    return {
      token,
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        cpf: userExists.cpf,
        ...(role === 'BUSINESS' && { companies: company }),
        ...(role === 'PROFESSIONAL' && {
          company_link: companyUser?.company_id,
        }),
        role: rolePermission,
      },
    };
  }
}
