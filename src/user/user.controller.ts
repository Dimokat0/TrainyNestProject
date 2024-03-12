import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  NotFoundException,
  Headers,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserService } from './user.service';
import { UserParamsDto } from 'src/dtos/dto.auth';
import { RolesEnum } from 'src/enums/roles.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: '[Get all users]',
    description: 'Get all users profiles',
  })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('roles')
  @ApiOperation({ summary: '[Get roles]' })
  getRoles() {
    return this.userService.getAllRoles();
  }
  @Get('getUserType')
  @ApiOperation({
    summary: '[Get user role]',
    description: 'Get user role by user_id',
  })
  async getUserType(@Headers('authorization') access_token: string) {
    const user = await this.userService.getUserByToken(access_token);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { userType: user.roleId };
  }

  @Get(':id')
  @ApiOperation({ summary: '[Get user]', description: 'Get single user by id' })
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @ApiOperation({
    summary: '[Create user]',
    description: 'Create user',
  })
  createUser(@Body() userParams: UserParamsDto) {
    this.userService.createUser(userParams);
    return { success: true };
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN])
  @ApiOperation({ summary: '[Update user]', description: 'Update user' })
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() userParams: UserParamsDto) {
    this.userService.updateUser(id, userParams);
    return { success: true };
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN])
  @ApiOperation({ summary: '[Delete user]', description: 'Delete single user' })
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    this.userService.deleteUser(id);
    return { success: true };
  }
}
