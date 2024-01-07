import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('google')
export class GoogleController {
  constructor(private readonly service: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token, refresh_token } = await this.service.googleLogin(req);
    res.cookie('accessToken', access_token, {
      maxAge: 3600000,
      httpOnly: false,
      path: '/',
    });
    res.cookie('refreshToken', refresh_token, {
      maxAge: 3600000,
      httpOnly: false,
      path: '/',
    });
    res.redirect('/postsPage');
  }
}
