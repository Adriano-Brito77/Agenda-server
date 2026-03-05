import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyServicesModule } from './company-services/company-services.module';
import { ProfessionalServicesModule } from './professional-services/professional-services.module';
import { ProfessionalSchedulesModule } from './professional-schedules/professional-schedules.module';
import { ExceptionDaysModule } from './exception-days/exception-days.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, CompanyServicesModule, ProfessionalServicesModule, ProfessionalSchedulesModule, ExceptionDaysModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
