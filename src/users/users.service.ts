import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { CompaniesService } from '../companies/companies.service';
import { PrismaService } from '../prisma.service';
import { PaginationService } from './../pagination/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserActiveDto } from './dto/update-user-active.dto';

export const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  birth_day: true,
  notification_time: true,
  phone_number: true,
  occupation: true,
  company_id: true,
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
    private company: CompaniesService,
  ) {}
  async create({
    name,
    email,
    cpf,
    role,
    phone_number,
    company_id,
    birth_day,
    occupation,
    password,
    notification_time,
    confirmPassword,
    company,
  }: CreateUserDto) {
    // 2) checa se já existe usuário (identidade é global: email OU cpf)
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { cpf }],
      },
    });

    // se existir e o email/cpf bater em outra pessoa (ex.: cpf já usado)
    // aqui você pode deixar mais detalhado, mas já evita duplicidade
    if (existingUser) {
      if (existingUser.email === email && existingUser.cpf !== cpf) {
        throw new ConflictException('Este e-mail já está em uso');
      }
      if (existingUser.cpf === cpf && existingUser.email !== email) {
        throw new ConflictException('Este CPF já está em uso');
      }
    }

    const date = birth_day ? new Date(birth_day) : null;

    /* valida se senha e confirmar senha conferem */
    if (password !== confirmPassword) {
      throw new ConflictException('Senha e confirmar senha devem ser iguais');
    }

    /* criptografa a senha para salvar no banco de dados */
    const passwordHash = await hash(password, 8);

    /* cria o usuário no banco de dados */
    const user =
      existingUser ??
      (await this.prisma.user.create({
        data: {
          name,
          email,
          cpf,
          password_hash: passwordHash,
          phone_number,
          birth_day: date,
          company_id,
          notification_time,
          occupation,
        },
      }));

    if (role === 'PROFESSIONAL' && company_id) {
      const company = await this.company.findOne(company_id);

      const userAlreadyExists = await this.prisma.companyUser.findFirst({
        where: { professional_id: user.id, company_id },
      });

      if (!userAlreadyExists) {
        await this.prisma.companyUser.create({
          data: {
            professional_id: user.id,
            company_id,
            creator_id: company.creator_id,
          },
        });
      }
    }

    if (role === 'BUSINESS' && company) {
      await this.prisma.$transaction(async (prisma) => {
        const companyCnpjAlreadyExists = await prisma.company.findUnique({
          where: { cnpj: company.cnpj },
        });

        if (companyCnpjAlreadyExists) {
          throw new ConflictException('Este CNPJ já está em uso');
        }

        const companyEmailAlreadyExists = await prisma.company.findUnique({
          where: { email: company.email },
        });

        if (companyEmailAlreadyExists) {
          throw new ConflictException('Este e-mail já está em uso');
        }

        const myCompany = await prisma.company.create({
          data: {
            name: company.name,
            email: company.email,
            cnpj: company.cnpj,
            open_date: company.open_date,
            phone_number: company.phone_number,
            start_time: company.start_time,
            end_time: company.end_time,
            address: company.address,
            cep: company.cep,
            number: company.number,
            complement: company.complement,
            creator_id: user.id,
          },
        });

        const userAlreadyExists = await prisma.companyUser.findFirst({
          where: { professional_id: user.id, company_id: myCompany.id },
        });

        if (!userAlreadyExists) {
          await prisma.companyUser.create({
            data: {
              professional_id: user.id,
              company_id: myCompany.id,
              creator_id: user.id,
            },
          });
        }
      });
    }

    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async findOne(id: string) {
    const userExist = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!userExist) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return userExist;
  }

  async updateActive(id: string, user_Active: UpdateUserActiveDto) {
    /* valida se o id existe*/
    const user = await this.findOne(id);

    /* valida se a empresa existe */
    const linkCompanyUser = await this.prisma.companyUser.findFirst({
      where: { professional_id: id, company_id: user_Active.company_id },
    });

    if (!linkCompanyUser) {
      throw new NotFoundException(
        'Vínculo do usuário com a empresa não encontrado',
      );
    }

    /* ativa ou desativa o usuário */
    await this.prisma.companyUser.update({
      where: { id: linkCompanyUser.id },
      data: { is_active: user_Active.active },
    });
  }

  async update(
    id: string,
    {
      name,
      cpf,
      email,
      password,
      confirmPassword,
      phone_number,
      birth_day,
      company_id,
      notification_time,
      occupation,
    }: UpdateUserDto,
  ) {
    /* valida se o id existe*/
    await this.findOne(id);

    /* valida se o e-mail já está em uso */
    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: { email, NOT: { id } },
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    /* valida se o CPF já está em uso */
    const cpfAlreadyExists = await this.prisma.user.findFirst({
      where: { cpf, NOT: { id } },
    });

    if (cpfAlreadyExists) {
      throw new ConflictException('Este CPF já está em uso');
    }

    const date = birth_day ? new Date(birth_day) : null;

    /* valida se senha e confirmar senha conferem */
    if (password !== confirmPassword) {
      throw new ConflictException('Senha e confirmar senha devem ser iguais');
    }

    /* criptografa a senha para salvar no banco de dados */
    const passwordHash = await hash(password, 8);

    /* atualiza os dados do usuário */
    await this.prisma.user.update({
      where: { id },
      data: {
        name,
        cpf,
        email,
        password_hash: passwordHash,
        phone_number,
        birth_day: date,
        company_id,
        notification_time,
        occupation,
      },
    });
  }

  async removeCompanyUser(id: string) {
    /* valida se o vinculo existe*/
    const companyUser = await this.prisma.companyUser.findUnique({
      where: { id },
    });
    if (!companyUser) {
      throw new NotFoundException(
        'Vínculo do usuário com a empresa não encontrado',
      );
    }

    /* remove o vínculo do usuário com a empresa */
    await this.prisma.companyUser.delete({
      where: { id },
    });
  }
}
