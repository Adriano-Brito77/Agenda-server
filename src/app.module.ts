import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyServicesModule } from './company-services/company-services.module';
import { ProfessionalServicesModule } from './professional-services/professional-services.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, CompanyServicesModule, ProfessionalServicesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
