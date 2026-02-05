import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyServicesModule } from './company-services/company-services.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, CompanyServicesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
