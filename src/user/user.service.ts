import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserParamsDto } from 'src/dtos/dto.auth';

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

  createUser(userParams: UserParamsDto) {
    return this.userRepository.createUser(userParams);
  }

  updateUser(id: number, userParams: UserParamsDto) {
    return this.userRepository.updateUser(id, userParams);
  }

  deleteUser(id: number) {
    return this.userRepository.deleteUser(id);
  }
}
