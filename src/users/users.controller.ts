import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from '../auth/jwt/jwt-guard';

import { createUserBodySchema, CreateUserDto } from './dto/create-user.dto';
import { updateUserBodySchema, UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CurrentUser, type AuthUser } from '../auth/jwt/current-user';
import {
  updateActiveUserBodySchema,
  UpdateUserActiveDto,
} from './dto/update-user-active.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  create(
    @Body(new ZodValidationPipe(createUserBodySchema))
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('/active/:id')
  @UseGuards(JwtGuard)
  updateActive(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(updateActiveUserBodySchema))
    user_Active: UpdateUserActiveDto,
  ) {
    return this.usersService.updateActive(id, user_Active);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserBodySchema))
    updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  removeCompanyUser(@Param('id') id: string) {
    return this.usersService.removeCompanyUser(id);
  }
}
