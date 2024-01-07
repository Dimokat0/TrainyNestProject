import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export interface MyJwtPayload extends JwtPayload {
  userId: number;
}

export interface Request {
  user?: MyJwtPayload;
}

export interface NewAccessTokenResult {
  success: boolean;
  accessToken?: string;
}

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private configService: ConfigService,
  ) {}

  async registerUser(username: string, password: string): Promise<any> {
    const check = await this.userModel.findOne({ where: { username } });
    if (check) {
      return { success: false, message: 'Username is taken' };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.create({ username, password: hashedPassword });
      const user = await this.userModel.findOne({ where: { username } });
      const accessTokenSecret =
        this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
        'default_secret';
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
      user.roleId = 1;
      user.save();
      return {
        success: true,
        message: 'Register Success!',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
  }

  async loginUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      return { success: false, message: 'Wrong username!' };
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const accessTokenSecret =
        this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
        'default_secret';
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
      user.save();
      return {
        success: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
      };
    }
    return { success: false, message: 'Wrong password!' };
  }

  async generateNewAccessToken(
    refreshToken: string,
  ): Promise<NewAccessTokenResult> {
    try {
      const refreshTokenSecret =
        this.configService.get<string>('REFRESH_TOKEN_SECRET') ||
        'default_secret';
      const payload = jwt.verify(
        refreshToken,
        refreshTokenSecret as string,
      ) as MyJwtPayload;
      const userId = payload.userId;
      const user = await User.findOne({
        where: { id: userId, refresh_token: refreshToken },
      });
      if (!user) {
        return { success: false };
      } else {
        const accessTokenSecret =
          this.configService.get<string>('ACCESS_TOKEN_SECRET') ||
          'default_secret';
        const accessToken = jwt.sign(
          { userId },
          accessTokenSecret as string,
          { expiresIn: '60m' },
          // eslint-disable-next-line prettier/prettier
        );
        return { success: true, accessToken };
      }
    } catch (err) {
      return { success: false };
    }
  }
}
