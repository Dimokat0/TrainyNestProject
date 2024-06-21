import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { GoogleRepository } from './google.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, GoogleRepository, ConfigService],
})
export class GoogleModule {}
