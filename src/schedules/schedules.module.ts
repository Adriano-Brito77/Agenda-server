import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/pagination.service';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, PrismaService, PaginationService],
})
export class SchedulesModule {}
