import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { Role } from './role/role.model';
import { Post } from './post/post.model';
import { Tag } from './tags/tag.model';
import { Category } from './category/category.model';
import { GoogleModule } from './google/google.module';
import { MiddlewareConsumer, NestModule } from '@nestjs/common/interfaces';
import { AuthMiddleware } from './auth/auth.middleware';
import { RequestMethod } from '@nestjs/common/enums';
import { FacebookModule } from './facebook/facebook.module';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'qwerty',
      database: 'first_project',
      models: [User, Role, Post, Tag, Category],
      synchronize: true,
    }),
    AuthModule,
    PostModule,
    UserModule,
    GoogleModule,
    FacebookModule,
    MailModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'manageUsersPage/', method: RequestMethod.GET },
        { path: 'postsPage/', method: RequestMethod.GET },
      );
  }
}
