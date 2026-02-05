import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService, PaginationService],
})
export class CompaniesModule {}
