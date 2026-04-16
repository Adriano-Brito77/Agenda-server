import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';

@Module({
  controllers: [StockMovementsController],
  providers: [StockMovementsService, PrismaService, PaginationService],
})
export class StockMovementsModule {}
