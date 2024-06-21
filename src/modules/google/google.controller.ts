import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';

@Controller('google')
export class GoogleController {
  constructor(private readonly service: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '[Google placeholder]',
    description: 'Placeholder for google auth redirect',
  })
  async googleAuth(@Req() req) {
    req;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '[Google login redirect]',
    description: 'Redirect for google authorization',
  })
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
