import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from 'src/pagination/pagination.service';

import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategyService } from './jwt/jwt-strategy.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30 day',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategyService,
    UsersService,
    PaginationService,
    PrismaService,
  ],
})
export class AuthModule {}
