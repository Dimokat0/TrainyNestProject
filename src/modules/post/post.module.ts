import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService, ConfigService],
  exports: [PostService],
})
export class PostModule {}
