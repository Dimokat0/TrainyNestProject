import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser(username: string, password: string) {
    return this.authRepository.registerUser(username, password);
  }

  loginUser(username: string, password: string) {
    return this.authRepository.loginUser(username, password);
  }

  accessToken(refreshToken: string) {
    return this.authRepository.generateNewAccessToken(refreshToken);
  }
}
