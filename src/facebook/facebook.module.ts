import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { FacebookController } from './facebook.controller';
import { FacebookRepository } from './facebook.repository';
import { FacebookService } from './facebook.service';
import { FacebookStrategy } from './facebook.strategy';

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
  controllers: [FacebookController],
  providers: [
    FacebookStrategy,
    FacebookRepository,
    FacebookService,
    ConfigService,
  ],
})
export class FacebookModule {}
