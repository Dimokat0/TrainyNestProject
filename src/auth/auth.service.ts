import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserParamsDto } from 'src/dtos/dto.auth';
@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  registerUser(userParams: UserParamsDto) {
    return this.authRepository.registerUser(userParams);
  }

  loginUser(userParams: UserParamsDto) {
    return this.authRepository.loginUser(userParams);
  }

  accessToken(refreshToken: string) {
    return this.authRepository.generateNewAccessToken(refreshToken);
  }
}
