import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenInterface } from 'src/interface';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private readonly TOKEN_SECRET = this.config.getOrThrow('TOKEN_SECRET');

  sign(payload, options?): any {
    return this.jwtService.sign(payload, options);
  }

  async signAsync(payload, options?): Promise<any> {
    return this.jwtService.signAsync(payload, options);
  }

  decode(token: string, options?): any {
    return this.jwtService.decode(token, options);
  }

  verify(token: string): TokenInterface {
    try {
      return this.jwtService.verify(token, { secret: this.TOKEN_SECRET });
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
