import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
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
  }: CreateUserDto) {
    /* valida se o e-mail já está em uso */
    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: { email, role },
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    /* valida se o CPF já está em uso */
    const cpfAlreadyExists = await this.prisma.user.findFirst({
      where: { cpf, role },
    });

    if (cpfAlreadyExists) {
      throw new ConflictException('Este CPF já está em uso');
    }

    if (birth_day) {
      birth_day = new Date(birth_day);
    }

    /* valida se senha e confirmar senha conferem */
    if (password !== confirmPassword) {
      throw new ConflictException('Senha e confirmar senha devem ser iguais');
    }

    /* criptografa a senha para salvar no banco de dados */
    const passwordHash = await hash(password, 8);

    /* cria o usuário no banco de dados */
    await this.prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password_hash: passwordHash,
        phone_number,
        birth_day: birth_day,
        company_id,
        notification_time,
        occupation,
        role,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
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
      where: { email, role, NOT: { id } },
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    /* valida se o CPF já está em uso */
    const cpfAlreadyExists = await this.prisma.user.findFirst({
      where: { cpf, role, NOT: { id } },
    });

    if (cpfAlreadyExists) {
      throw new ConflictException('Este CPF já está em uso');
    }

    if (birth_day) {
      birth_day = new Date(birth_day);
    }

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
        role,
        birth_day: birth_day,
        company_id,
        notification_time,
        occupation,
      },
    });
  }
}
