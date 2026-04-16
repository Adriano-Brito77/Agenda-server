import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create({
    name,
    description,
    barcode,
    price,
    unit,
    company_id,
  }: CreateProductDto) {
    /* valida se a empresa existe */
    const companyAlreadyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyAlreadyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }
    /* valida se o codigo de barras já existe */
    const product = await this.prisma.products.findFirst({
      where: { barcode, company_id },
    });
    if (product) {
      throw new BadRequestException('Codigo de barras já utilizado');
    }

    /* cria o produto no banco de dados*/
    await this.prisma.products.create({
      data: {
        name,
        description,
        barcode,
        price,
        unit,
        company_id,
      },
    });
  }

  async findByCompany({
    page,
    pageSize,
    orderBy,
    search,
    company_id,
  }: PaginationDto) {
    /* valida se a empresa existe */
    const companyAlreadyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyAlreadyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }
    const where = {
      company_id,
      name: { contains: search, mode: 'insensitive' },
    };

    const order = orderBy
      ? { [orderBy.split(':')[0]]: orderBy.split(':')[1] }
      : { created_at: 'desc' };

    const products = await this.paginationService.paginate(
      this.prisma.products,
      {
        where,
        orderBy: order,
        page,
        pageSize,
      },
    );

    return products;
  }

  async findOne(id: string) {
    /* valida se o produto existe */
    const product = await this.prisma.products.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  async update(
    id: string,
    { name, description, barcode, price, unit, company_id }: UpdateProductDto,
  ) {
    await this.findOne(id);

    /* valida se a empresa existe */
    const companyAlreadyExists = await this.prisma.company.findUnique({
      where: { id: company_id },
    });
    if (!companyAlreadyExists) {
      throw new NotFoundException('Empresa não encontrada');
    }
    /* valida se o codigo de barras já existe */
    const product = await this.prisma.products.findFirst({
      where: { barcode, company_id, id: { not: id } },
    });
    if (product) {
      throw new BadRequestException('Codigo de barras já utilizado');
    }

    /* atualiza o produto no banco de dados */
    await this.prisma.products.update({
      where: { id },
      data: {
        name,
        description,
        barcode,
        price,
        unit,
        company_id,
      },
    });
  }

  async remove(id: string) {
    /* valida se o produto existe */
    await this.findOne(id);

    /* Deleta o produto do banco de dados */
    await this.prisma.products.delete({
      where: { id },
    });
  }
}
