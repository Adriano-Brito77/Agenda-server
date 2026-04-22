import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { ProfessionalSchedulesModule } from '../professional-schedules/professional-schedules.module';
import { UsersService } from '../users/users.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    PrismaService,
    PaginationService,
    UsersService,
    ProfessionalSchedulesModule,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
