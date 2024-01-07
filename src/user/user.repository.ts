import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from 'src/role/role.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { MyJwtPayload } from 'src/auth/auth.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private configService: ConfigService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async getAllRoles(): Promise<Role[]> {
    return Role.findAll();
  }

  async getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async getUserByToken(access_token: string): Promise<User> {
    console.log('Access Token:', access_token);
    const payload = jwt.verify(
      access_token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    ) as MyJwtPayload;
    const id = payload.userId;
    return this.userModel.findByPk(id);
  }

  async createUser(username: string, password: string, roleId?: number) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.roleId = roleId || 1;
    user.save();
    return { success: true };
  }

  async updateUser(
    id: number,
    username?: string,
    password?: string,
    roleId?: number,
  ): Promise<[number]> {
    const updateData: {
      username?: string;
      password?: string;
      roleId?: number;
    } = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (roleId) updateData.roleId = roleId;
    return this.userModel.update(updateData, { where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }
}
