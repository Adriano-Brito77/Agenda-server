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

import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateAuthAdminDto } from './dto/create-auth-admin.dto';
import { CreateAuthProfessionalDto } from './dto/create-auth-professional.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create({ cpf, password }: CreateAuthDto) {
    /* valida se o CPF existe */
    const cpfExists = await this.prisma.user.findFirst({
      where: {
        cpf,
        role: 'user',
      },
    });

    if (!cpfExists) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    /* valida se a senha está correta */
    const passwordMatch = await compare(password, cpfExists.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    /* gera o token JWT */
    const token = this.jwtService.sign({
      sub: cpfExists.id,
      email: cpfExists.email,
      role: cpfExists.role,
    });

    return {
      token,
      user: {
        id: cpfExists.id,
        name: cpfExists.name,
        email: cpfExists.email,
        cpf: cpfExists.cpf,
        role: cpfExists.role,
      },
    };
  }

  async createProfessional({ email, password }: CreateAuthProfessionalDto) {
    /* valida se o email existe */
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
        role: 'professional',
      },
    });

    if (!emailExists) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    /* valida se a senha está correta */
    const passwordMatch = await compare(password, emailExists.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    /* gera o token JWT */
    const token = this.jwtService.sign({
      sub: emailExists.id,
      email: emailExists.email,
      role: emailExists.role,
    });

    return {
      token,
      user: {
        id: emailExists.id,
        name: emailExists.name,
        email: emailExists.email,
        cpf: emailExists.cpf,
        role: emailExists.role,
      },
    };
  }

  async createAdmin({ email, password }: CreateAuthAdminDto) {
    /* valida se o email existe */
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
        role: 'admin',
      },
    });

    if (!emailExists) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    /* valida se a senha está correta */
    const passwordMatch = await compare(password, emailExists.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    /* gera o token JWT */
    const token = this.jwtService.sign({
      sub: emailExists.id,
      email: emailExists.email,
      role: emailExists.role,
    });

    return {
      token,
      user: {
        id: emailExists.id,
        name: emailExists.name,
        email: emailExists.email,
        cpf: emailExists.cpf,
        role: emailExists.role,
      },
    };
  }
}
