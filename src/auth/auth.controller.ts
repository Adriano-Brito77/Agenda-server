import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import {
  createAuthAdminBodySchema,
  CreateAuthAdminDto,
} from './dto/create-auth-admin.dto';
import {
  createAuthProfessionalBodySchema,
  CreateAuthProfessionalDto,
} from './dto/create-auth-professional.dto';
import { createAuthBodySchema, CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(
    @Body(new ZodValidationPipe(createAuthBodySchema))
    { cpf, password }: CreateAuthDto,
  ) {
    return this.authService.create({
      cpf,
      password,
    });
  }

  @Post('professional')
  createProfessional(
    @Body(new ZodValidationPipe(createAuthProfessionalBodySchema))
    { email, password }: CreateAuthProfessionalDto,
  ) {
    return this.authService.createProfessional({
      email,
      password,
    });
  }

  @Post('admin')
  createAdmin(
    @Body(new ZodValidationPipe(createAuthAdminBodySchema))
    { email, password }: CreateAuthAdminDto,
  ) {
    return this.authService.createAdmin({
      email,
      password,
    });
  }
}
