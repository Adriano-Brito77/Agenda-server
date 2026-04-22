import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyServicesModule } from './company-services/company-services.module';
import { ProfessionalServicesModule } from './professional-services/professional-services.module';
import { ProfessionalSchedulesModule } from './professional-schedules/professional-schedules.module';
import { ExceptionDaysModule } from './exception-days/exception-days.module';
import { ProductsModule } from './products/products.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [UsersModule, AuthModule, CompaniesModule, CompanyServicesModule, ProfessionalServicesModule, ProfessionalSchedulesModule, ExceptionDaysModule, ProductsModule, StockMovementsModule, PurchaseOrdersModule, SchedulesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
