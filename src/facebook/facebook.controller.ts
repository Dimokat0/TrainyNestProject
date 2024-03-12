import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { FacebookService } from './facebook.service';

@Controller()
export class FacebookController {
  constructor(private readonly service: FacebookService) {}

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: '[Facebook placeholder]',
    description: 'Placeholder for facebook auth redirect',
  })
  async facebookLogin(@Req() req) {
    req;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({
    summary: '[Facebook login redirect]',
    description: 'Redirect for facebook authorization',
  })
  async facebookLoginRedirect(@Req() req, @Res() res): Promise<any> {
    const { access_token, refresh_token } =
      await this.service.facebookLogin(req);
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
