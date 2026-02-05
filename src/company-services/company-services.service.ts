import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyServiceDto } from './dto/create-company-service.dto';
import { UpdateCompanyServiceDto } from './dto/update-company-service.dto';
import { PrismaService } from 'src/prisma.service';
import { CompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyServicesService {
  constructor(private prisma: PrismaService) {}

  async create({ name, description, company_id }: CreateCompanyServiceDto) {
    /* valida se a empresa existe*/
    const companyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });

    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    await this.prisma.companyService.create({
      data: {
        name,
        description,
        company_id,
      },
    });
    return;
  }

  async findAll({ company_id }: CompanyDto) {
    const services = await this.prisma.companyService.findMany({
      where: { company_id },
    });

    if (services.length === 0) {
      throw new NotFoundException(
        'Nenhum serviço encontrado para esta empresa.',
      );
    }
    return services;
  }

  async findOne(id: string) {
    const service = await this.prisma.companyService.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado.');
    }
    return service;
  }

  async update(
    id: string,
    { name, description, company_id }: UpdateCompanyServiceDto,
  ) {
    /* valida se o id existe*/
    await this.findOne(id);

    /* valida se a empresa existe*/
    const companyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });

    if (!companyExists) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    await this.prisma.companyService.update({
      where: { id },
      data: {
        name,
        description,
        company_id,
      },
    });
    return;
  }
}
