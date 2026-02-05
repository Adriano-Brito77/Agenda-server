import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    {
      name,
      cnpj,
      email,
      start_time,
      end_time,
      open_date,
      phone_number,
      address,
    }: CreateCompanyDto,
    user_id: string,
  ) {
    /* valida se o CNPJ já está em uso */
    const cnpjExists = await this.prisma.company.findFirst({
      where: { cnpj },
    });
    if (cnpjExists) {
      throw new ConflictException('Este CNPJ já está em uso');
    }

    /* valida se o email ja está em uso*/
    const emailExists = await this.prisma.company.findFirst({
      where: { email },
    });
    if (emailExists) {
      throw new ConflictException('Este email já está em uso');
    }

    /* cria uma empresa no banco de dados */
    await this.prisma.company.create({
      data: {
        name,
        cnpj,
        email,
        start_time,
        end_time,
        open_date,
        phone_number,
        address,
        user_id,
      },
    });
  }

  async findAll({ page, pageSize, orderBy, search }: PaginationDto) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { cnpj: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const order = orderBy
      ? {
          [orderBy.field]: orderBy.direction,
        }
      : {};

    const campanies = await this.paginationService.paginate(
      this.prisma.company,
      {
        page,
        pageSize,
        where,
        orderBy: order,
      },
    );

    return campanies;
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    return company;
  }

  async update(
    id: string,
    {
      name,
      email,
      cnpj,
      start_time,
      end_time,
      open_date,
      phone_number,
      address,
    }: UpdateCompanyDto,
  ) {
    /* valida se o id existe*/
    await this.findOne(id);

    /* valida se o CNPJ já está em uso */
    const cnpjExists = await this.prisma.company.findFirst({
      where: { cnpj, NOT: { id } },
    });
    if (cnpjExists) {
      throw new ConflictException('Este CNPJ já está em uso');
    }

    /* valida se o email ja está em uso*/
    const emailExists = await this.prisma.company.findFirst({
      where: { email, NOT: { id } },
    });
    if (emailExists) {
      throw new ConflictException('Este email já está em uso');
    }

    /* atualiza a empresa no banco de dados */
    await this.prisma.company.update({
      where: { id },
      data: {
        name,
        email,
        cnpj,
        start_time,
        end_time,
        open_date,
        phone_number,
        address,
      },
    });
  }
}
