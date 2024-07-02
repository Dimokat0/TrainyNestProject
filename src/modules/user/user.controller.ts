import { Controller, Get, Delete, Param } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationRequestDto, UserResponseDto } from 'src/common/dto';
import { HttpAuthPermission } from 'src/guards';
import { PaginatedUsersResponseDto } from './dto/paginated-users-res.dto';
import { UserService } from './user.service';
import { rolesEnum } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({
    summary: '[Get all users]',
    description: 'Get all users profiles',
  })
  @ApiResponse({ type: PaginatedUsersResponseDto })
  getAllUsers(
    @Query() dto: PaginationRequestDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.userService.getAllUsers(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Get user]', description: 'Get single user by id' })
  @ApiResponse({ type: UserResponseDto })
  getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @HttpAuthPermission(rolesEnum.ADMIN)
  @ApiOperation({ summary: '[Delete user]', description: 'Delete single user' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
