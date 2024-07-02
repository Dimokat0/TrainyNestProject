import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SmsService } from 'src/modules/sms/sms.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthService } from './jwt.auth.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './google.auth.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    JwtAuthService,
    AuthService,
    PrismaService,
    SmsService,
    RedisService,
    ConfigService,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
