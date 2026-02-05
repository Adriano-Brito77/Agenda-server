import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  createCompaniesBodySchema,
  CreateCompanyDto,
} from './dto/create-company.dto';
import {
  updateCompaniesBodySchema,
  UpdateCompanyDto,
} from './dto/update-company.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from 'src/auth/jwt/current-user';
import type { AuthUser } from 'src/auth/jwt/current-user';
import { JwtGuard } from 'src/auth/jwt/jwt-guard';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

@Controller('companies')
@UseGuards(JwtGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCompaniesBodySchema))
    createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.companiesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCompaniesBodySchema))
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }
}
