import { Module } from '@nestjs/common';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { ProfessionalServicesController } from './professional-services.controller';
import { ProfessionalServicesService } from './professional-services.service';

@Module({
  controllers: [ProfessionalServicesController],
  providers: [ProfessionalServicesService, PaginationService, PrismaService],
})
export class ProfessionalServicesModule {}
