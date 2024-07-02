import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { SignUpRequestDto } from './dto/sign-up-req.dto';
import { SignInRequestDto } from './dto/sign-in-req.dto';
import { UserResponseDto } from '../../common/dto/user-res.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '[Register user]',
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
    summary: '[Login user]',
    description: 'Auth endpoint for user login',
  })
  @ApiResponse({ type: UserResponseDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  loginUser(@Body() dto: SignInRequestDto) {
    return this.authService.login(dto);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Send otp]',
    description: 'Send otp by phone number',
  })
  async sendOtp(@Query('phone') phone: string) {
    await this.authService.sendOtp(phone);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Verify otp]',
    description: 'Verify otp by phone number',
  })
  async verifyOtp(@Query() data: { phone: string; otp: string }) {
    return await this.authService.verifyOtp(data.phone, data.otp);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '[Google placeholder]',
    description: 'Placeholder for google auth redirect',
  })
  async googleAuth(@Req() req) {
    return;
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '[Google login redirect]',
    description: 'Redirect for google authorization',
  })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const userResponse = await this.authService.googleLogin(req);
    res.cookie('accessToken', userResponse.accessToken, {
      maxAge: 3600000,
      httpOnly: false,
      path: '/',
    });
    res.redirect('/posts.html');
  }
}
