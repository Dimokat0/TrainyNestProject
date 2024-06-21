import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SmsService } from 'src/modules/sms/sms.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, SmsService, RedisService, ConfigService],
})
export class AuthModule {}
