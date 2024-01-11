import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserParamsDto } from 'src/dtos/dto.auth';
import { NewAccessTokenResultDto } from 'src/dtos/dto.auth';

export interface MyJwtPayload extends JwtPayload {
  userId: number;
}

export interface Request {
  user?: MyJwtPayload;
}

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private configService: ConfigService,
  ) {}

  async registerUser(userParams: UserParamsDto): Promise<any> {
    const username = userParams.username;
    const password = userParams.password;
    const check = await this.userModel.findOne({ where: { username } });
    if (check) {
      throw new BadRequestException('Username is taken!');
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

  async loginUser(userParams: UserParamsDto): Promise<any> {
    const username = userParams.username;
    const password = userParams.password;
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Wrong username!');
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
    throw new BadRequestException('Wrong password!');
  }

  async generateNewAccessToken(
    refreshToken: string,
  ): Promise<NewAccessTokenResultDto> {
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
        throw new UnauthorizedException('Unathorized!');
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
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: err,
      });
    }
  }
}
