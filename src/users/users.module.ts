import { Module } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { ProfessionalSchedulesModule } from '../professional-schedules/professional-schedules.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    PaginationService,
    CompaniesService,
    ProfessionalSchedulesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
