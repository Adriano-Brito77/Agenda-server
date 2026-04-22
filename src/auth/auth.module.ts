import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaginationService } from '../pagination/pagination.service';

import { CompaniesService } from '../companies/companies.service';
import { PrismaService } from '../prisma.service';
import { ProfessionalSchedulesModule } from '../professional-schedules/professional-schedules.module';
import { UsersService } from '../users/users.service';
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
    CompaniesService,
    ProfessionalSchedulesModule,
  ],
})
export class AuthModule {}
