import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService, PaginationService],
})
export class CompaniesModule {}
