import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SmsService } from '../sms/sms.service';
import { RedisService } from '../redis/redis.service';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SignUpRequestDto } from './dto/sign-up-req.dto';
import { SignInRequestDto } from './dto/sign-in-req.dto';
import { UserResponseDto } from '../../common/dto/user-res.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    private readonly redisService: RedisService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register user',
    description: 'Auth endpoint for user registration',
  })
  @ApiResponse({ type: UserResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  registerUser(@Body() dto: SignUpRequestDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Auth endpoint for user login',
  })
  @ApiResponse({ type: UserResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  loginUser(@Body() dto: SignInRequestDto) {
    return this.authService.login(dto);
  }

  @Post('send-otp')
  @ApiOperation({
    summary: 'Send otp',
    description: 'Send otp by phone number',
  })
  async sendOtp(@Body() body: { phone: string }) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.smsService.sendSms(body.phone, `Your code is: ${otp}`);
    await this.redisService.setOtp(body.phone, otp);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify otp',
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
