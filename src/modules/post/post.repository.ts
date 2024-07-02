import { Injectable, NotFoundException } from '@nestjs/common';
import { PostParamsDto } from './dto/post-params.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PostResponseDto } from './dto/post-res.dto';
import { PaginatedPostsResponseDto } from './dto/paginated-posts-res.dto';
import { PaginationRequestDto } from 'src/common/dto';
import { Prisma } from '@prisma/client';

type PostUpdateInputCombined = Prisma.postUncheckedUpdateInput &
  Prisma.postUpdateInput;

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPosts(
    dto: PaginationRequestDto,
  ): Promise<PaginatedPostsResponseDto> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const posts = await this.prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: true,
        tags: true,
        category: true,
      },
    });
    return {
      page,
      limit,
      data: posts.map((post) => PostResponseDto.mapFrom(post)),
    };
  }

  async createPost(
    userId: string,
    postParams: PostParamsDto,
  ): Promise<PostResponseDto> {
    const { title, content, category, tags } = postParams;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id: ${userId} is not found`);
    }

    const post = await this.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
        category: { connect: { name: category } },
        tags: { connect: tags.map((tag) => ({ name: tag })) },
      },
      include: {
        author: true,
        tags: true,
        category: true,
      },
    });
    const response = PostResponseDto.mapFrom(post);
    return response;
  }

  async updatePost(
    id: string,
    postParams: PostParamsDto,
  ): Promise<PostResponseDto> {
    const { title, content, category, tags } = postParams;
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id: ${id} is not found`);
    }
    const updateData: PostUpdateInputCombined = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) {
      updateData.category = { connect: { name: category } };
    }
    if (tags) {
      const tagNames = await Promise.all(
        tags.map(async (tag) => {
          const tagName = await this.prisma.tag.upsert({
            where: { name: tag },
            create: { name: tag },
            update: {},
          });
          return tagName;
        }),
      );
      updateData.tags = { connect: tagNames.map((t) => ({ id: t.id })) };
    }
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData as Prisma.postUpdateInput,
      include: {
        author: true,
        tags: true,
        category: true,
      },
    });

    const response = PostResponseDto.mapFrom(updatedPost);
    return response;
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }
}
