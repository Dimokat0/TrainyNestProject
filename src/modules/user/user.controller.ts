import { Controller, Get, Param } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users profiles',
  })
  getAllUsers(@Query() dto: PaginationRequestDto) {
    return this.userService.getAllUsers(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Get user]', description: 'Get single user by id' })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
