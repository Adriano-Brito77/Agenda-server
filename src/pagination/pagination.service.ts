import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface PaginationParams<T1, T2> {
  page?: number;
  pageSize?: number;
  where?: T1;
  orderBy?: T2;
  include?: any;
  select?: any;
}

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) {}
  async paginate<T1, T2>(model: any, params: PaginationParams<T1, T2>) {
    params.page = Number(params.page);

    params.pageSize = Number(params.pageSize);

    const { page, pageSize, where, orderBy, select } = params;

    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize;

    const [data, totalCount] = await this.prisma.$transaction([
      model.findMany({
        include: params?.include,
        skip,
        take,
        where,
        orderBy,
        select,
      }),
      model.count({
        where,
      }),
    ]);

    const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 1;

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }
}
