import { Module } from '@nestjs/common';
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
  ],
})
export class ProfessionalSchedulesModule {}
