import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as crypto from 'node:crypto';
import * as util from 'node:util';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt.auth.service';
import { SignUpRequestDto } from './dto/sign-up-req.dto';
import { UserResponseDto } from '../../common/dto/user-res.dto';
import { Prisma } from '@prisma/client';
import { SignInRequestDto } from './dto/sign-in-req.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  private readonly ENCRYPT_ITERATIONS =
    this.config.getOrThrow<number>('ENCRYPT_ITERATIONS');
  private readonly ENCRYPT_KEY_LENGTH =
    this.config.getOrThrow<number>('ENCRYPT_KEY_LENGTH');
  private readonly ENCRYPT_DIGEST: string =
    this.config.getOrThrow('ENCRYPT_DIGEST');

  async register(dto: SignUpRequestDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            username: dto.username,
          },
        ],
      },
    });
    if (user) {
      throw new UnauthorizedException('User already exist');
    }
    dto.password = await this.encryptPassword(dto.password);
    const data: Prisma.userUncheckedCreateInput = {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    };
    const createdUser = await this.prisma.user.create({
      data,
    });
    const accessToken = await this.generateJwt({
      userId: createdUser.id,
    });
    const userResponse = UserResponseDto.mapFrom(createdUser);
    userResponse.accessToken = accessToken;
    return userResponse;
  }

  async login(dto: SignInRequestDto): Promise<UserResponseDto> {
    const { usernameOrMail, password } = dto;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: usernameOrMail,
          },
          {
            username: usernameOrMail,
          },
        ],
      },
    });
    if (!user) {
      throw new UnauthorizedException('Incorrect credentials');
    }
    if (!(await this.checkPassword(password, user.password))) {
      throw new UnauthorizedException('Incorrect credentials');
    }
    const accessToken = await this.generateJwt({
      userId: user.id,
    });
    const userResponse = UserResponseDto.mapFrom(user);
    userResponse.accessToken = accessToken;
    return userResponse;
  }

  private async encryptPassword(plainPassword: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      plainPassword,
      salt,
      this.ENCRYPT_ITERATIONS,
      this.ENCRYPT_KEY_LENGTH,
      this.ENCRYPT_DIGEST,
    );

    return salt + ':' + encryptedPassword.toString('hex');
  }

  private async checkPassword(
    password: string,
    existPassword: string,
  ): Promise<boolean> {
    const [salt, key] = existPassword.split(':');

    const crypt = util.promisify(crypto.pbkdf2);

    const encryptedPassword = await crypt(
      password,
      salt,
      this.ENCRYPT_ITERATIONS,
      this.ENCRYPT_KEY_LENGTH,
      this.ENCRYPT_DIGEST,
    );
    return key === encryptedPassword.toString('hex');
  }

  private async generateJwt(payload): Promise<string> {
    return this.jwtAuthService.signAsync(payload);
  }
}
