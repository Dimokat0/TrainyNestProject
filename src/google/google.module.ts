import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { GoogleRepository } from './google.repository';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule, SequelizeModule.forFeature([User])],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
          signOptions: { expiresIn: '1h' },
        } as JwtModuleOptions;
      },
    }),
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, GoogleRepository, ConfigService],
})
export class GoogleModule {}
