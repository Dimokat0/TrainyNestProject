import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserParamsDto } from 'src/dtos/dto.auth';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() userParams: UserParamsDto) {
    return this.authService.registerUser(userParams);
  }

  @Post('login')
  loginUser(@Body() userParams: UserParamsDto) {
    return this.authService.loginUser(userParams);
  }

  @Post('refresh')
  accessToken(@Body('access-token') accessToken: string) {
    return this.authService.accessToken(accessToken);
  }
}
