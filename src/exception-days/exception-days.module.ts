import { Module } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { ExceptionDaysController } from './exception-days.controller';
import { ExceptionDaysService } from './exception-days.service';

@Module({
  controllers: [ExceptionDaysController],
  providers: [ExceptionDaysService, PaginationService, PrismaService],
})
export class ExceptionDaysModule {}
