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

export const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  role: true,
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
      await this.company.findOne(company_id);

      const userAlreadyExists = await this.prisma.companyUser.findFirst({
        where: { user_id: user.id, company_id },
      });

      if (!userAlreadyExists) {
        await this.prisma.companyUser.create({
          data: {
            user_id: user.id,
            company_id,
          },
        });
      }
    }

    if (role === 'BUSINESS' && company) {
      await this.company.create(
        {
          name: company.name,
          email: company.cnpj,
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
        user.id,
      );
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

  async update(
    id: string,
    {
      name,
      cpf,
      email,
      password,
      confirmPassword,
      phone_number,
      role,
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

    /* valida se ja existe o vinculo de profissional com a empresa */
    if (role === 'PROFESSIONAL' && company_id) {
      const existingLink = await this.prisma.companyUser.findFirst({
        where: { user_id: id, company_id },
      });
      if (!existingLink) {
        await this.prisma.companyUser.create({
          data: {
            user_id: id,
            company_id,
          },
        });
      }
    }

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
}
