import { Module } from '@nestjs/common';
import { ExceptionDaysService } from 'src/exception-days/exception-days.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
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
  ],
})
export class ProfessionalSchedulesModule {}
