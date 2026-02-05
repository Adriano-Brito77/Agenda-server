import { Module } from '@nestjs/common';
import { CompanyServicesService } from './company-services.service';
import { CompanyServicesController } from './company-services.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CompanyServicesController],
  providers: [CompanyServicesService, PrismaService],
})
export class CompanyServicesModule {}
