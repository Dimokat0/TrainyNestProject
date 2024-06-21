import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { AuthMiddleware } from 'src/modules/auth/auth.middleware';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { UserRepository } from 'src/modules/user/user.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    UserService,
    UserRepository,
    ConfigService,
  ],
  exports: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'posts/', method: RequestMethod.GET },
        { path: 'posts/', method: RequestMethod.POST },
        { path: 'posts/:id', method: RequestMethod.PATCH },
        { path: 'posts/:id', method: RequestMethod.DELETE },
      );
  }
}
