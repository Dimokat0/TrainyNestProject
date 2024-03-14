import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class FacebookRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private configService: ConfigService,
  ) {}

  async verifyUser(userinfo): Promise<any> {
    const username = userinfo.user.firstName + ' ' + userinfo.user.lastName;
    const f_id = userinfo.user.id.toString();
    const password = '0';
    const user_result = await this.userModel.findOrCreate({
      where: { f_id, username, password },
    });
    const user = user_result[0];
    const accessTokenSecret =
      this.configService.get<string>('ACCESS_TOKEN_SECRET') || 'default_secret';
    const accessToken = jwt.sign({ userId: user.id }, accessTokenSecret, {
      expiresIn: '1h',
    });
    const refreshTokenSecret =
      this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
      'default_secret';
    const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
      expiresIn: '1h',
    });
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    user_result[1] ? (user.roleId = 1) : null;
    user.save();
    return {
      success: true,
      message: 'Verify success',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
