import { Module } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { ExceptionDaysService } from '../exception-days/exception-days.service';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { ProfessionalSchedulesController } from './professional-schedules.controller';
import { ProfessionalSchedulesService } from './professional-schedules.service';

@Module({
  controllers: [ProfessionalSchedulesController],
  providers: [
    ProfessionalSchedulesService,
    PrismaService,
    PaginationService,
    UsersService,
    ExceptionDaysService,
    CompaniesService,
  ],
  exports: [ProfessionalSchedulesService],
})
export class ProfessionalSchedulesModule {}
