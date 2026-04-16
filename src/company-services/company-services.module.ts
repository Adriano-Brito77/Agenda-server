import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CompanyServicesController } from './company-services.controller';
import { CompanyServicesService } from './company-services.service';

@Module({
  controllers: [CompanyServicesController],
  providers: [CompanyServicesService, PrismaService],
})
export class CompanyServicesModule {}
