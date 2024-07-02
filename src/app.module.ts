import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './modules/mail/mail.module';
import { PrismaService } from 'prisma/prisma.service';
import { join } from 'path';
import { config } from 'dotenv';

config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    AuthModule,
    PostModule,
    UserModule,
    MailModule,
    BullModule.forRoot({
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    }),
  ],
  providers: [PrismaService, ConfigService],
  exports: [ConfigModule],
})
export class AppModule {}
