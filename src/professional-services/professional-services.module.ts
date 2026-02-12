import { Module } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { ProfessionalServicesController } from './professional-services.controller';
import { ProfessionalServicesService } from './professional-services.service';

@Module({
  controllers: [ProfessionalServicesController],
  providers: [ProfessionalServicesService, PaginationService, PrismaService],
})
export class ProfessionalServicesModule {}
