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
import { RolesGuard } from 'src/auth/roles.guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('roles')
  getRoles() {
    return this.userService.getAllRoles();
  }
  @Get('getUserType')
  async getUserType(@Headers('authorization') access_token: string) {
    const user = await this.userService.getUserByToken(access_token);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { userType: user.roleId };
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('roleId') roleId: number,
  ) {
    this.userService.createUser(username, password, roleId);
    return { success: true };
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('roleId') roleId: number,
  ) {
    this.userService.updateUser(id, username, password, roleId);
    return { success: true };
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    this.userService.deleteUser(id);
    return { success: true };
  }
}
