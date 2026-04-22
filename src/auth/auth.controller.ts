import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { createAuthBodySchema, CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(
    @Body(new ZodValidationPipe(createAuthBodySchema))
    { cpfemail, password, role }: CreateAuthDto,
  ) {
    return this.authService.login({
      cpfemail,
      password,
      role,
    });
  }
}
