import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FacebookService } from './facebook.service';

@Controller()
export class FacebookController {
  constructor(private readonly service: FacebookService) {}

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(@Req() req) {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
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
