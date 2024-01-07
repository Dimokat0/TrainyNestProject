import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  getAllRoles() {
    return this.userRepository.getAllRoles();
  }
  getUserById(id: number) {
    return this.userRepository.getUserById(id);
  }

  getUserByToken(access_token: string) {
    return this.userRepository.getUserByToken(access_token);
  }

  createUser(username: string, password: string, roleId?: number) {
    return this.userRepository.createUser(username, password, roleId);
  }

  updateUser(
    id: number,
    username?: string,
    password?: string,
    roleId?: number,
  ) {
    return this.userRepository.updateUser(id, username, password, roleId);
  }

  deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }
}
