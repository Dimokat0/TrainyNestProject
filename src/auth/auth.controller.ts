import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserParamsDto } from 'src/dtos/dto.auth';
import { SmsService } from '../sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    private readonly redisService: RedisService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: '[Register user]',
    description: 'Auth endpoint for user registration',
  })
  registerUser(@Body() userParams: UserParamsDto) {
    return this.authService.registerUser(userParams);
  }

  @Post('login')
  @ApiOperation({
    summary: '[Login user]',
    description: 'Auth endpoint for user login',
  })
  loginUser(@Body() userParams: UserParamsDto) {
    return this.authService.loginUser(userParams);
  }

  @Post('refresh')
  @ApiOperation({
    summary: '[Refresh token]',
    description: 'Refresh access token',
  })
  accessToken(@Body('access-token') accessToken: string) {
    return this.authService.accessToken(accessToken);
  }

  @Post('send-otp')
  @ApiOperation({
    summary: '[Send otp]',
    description: 'Send otp by phone number',
  })
  async sendOtp(@Body() body: { phone: string }) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.smsService.sendSms(body.phone, `Your code is: ${otp}`);
    await this.redisService.setOtp(body.phone, otp);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: '[Verify otp]',
    description: 'Verify otp by phone number',
  })
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    const otp = await this.redisService.getOtp(body.phone);
    if (otp === body.otp) {
      return true;
    } else {
      return false;
    }
  }
}
