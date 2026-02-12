import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { CompanyServicesService } from './company-services.service';
import { CompanyDto } from './dto/company.dto';
import {
  createCompanyServiceBodySchema,
  CreateCompanyServiceDto,
} from './dto/create-company-service.dto';
import { UpdateCompanyServiceDto } from './dto/update-company-service.dto';

@Controller('company-services')
@UseGuards(JwtGuard)
export class CompanyServicesController {
  constructor(
    private readonly companyServicesService: CompanyServicesService,
  ) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCompanyServiceBodySchema))
    createCompanyServiceDto: CreateCompanyServiceDto,
  ) {
    return this.companyServicesService.create(createCompanyServiceDto);
  }

  @Get()
  findAll(@Query() company: CompanyDto) {
    return this.companyServicesService.findAll(company);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyServicesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyServiceDto: UpdateCompanyServiceDto,
  ) {
    return this.companyServicesService.update(id, updateCompanyServiceDto);
  }
}
