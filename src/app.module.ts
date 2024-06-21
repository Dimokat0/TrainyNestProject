import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleModule } from './modules/google/google.module';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './modules/mail/mail.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    PostModule,
    UserModule,
    GoogleModule,
    MailModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ConfigService],
  exports: [ConfigModule],
})
export class AppModule {}
