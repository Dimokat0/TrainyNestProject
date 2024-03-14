import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { MyJwtPayload } from 'src/auth/auth.repository';
import { Category } from 'src/category/category.model';
import { Tag } from 'src/tags/tag.model';
import { PostParamsDto } from 'src/dtos/dto.post';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    readonly configService: ConfigService,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postModel.findAll({ include: ['author', 'tags', 'category'] });
  }

  async createPost(
    access_token: string,
    postParams: PostParamsDto,
  ): Promise<Post> {
    const name = postParams.name;
    const caption = postParams.caption;
    const tags = postParams.tags;
    const category = postParams.category;

    const payload = jwt.verify(
      access_token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    ) as MyJwtPayload;
    const authorId = payload.userId;
    const [categoryName] = await Category.findOrCreate({
      where: { name: category },
    });
    const tagNames = await Promise.all(
      tags.map(async (tag) => {
        const [tagName] = await Tag.findOrCreate({ where: { name: tag } });
        return tagName;
      }),
    );
    const tagIds = tagNames.map((tag) => tag.id);
    const post = await this.postModel.create({
      name,
      caption,
      date: new Date(),
      authorId,
      categoryId: categoryName.id,
    });
    await post.$set('tags', tagIds);
    await post.$set('category', categoryName.id);
    return post;
  }

  async updatePost(id: number, postParams: PostParamsDto): Promise<[number]> {
    const name = postParams.name;
    const caption = postParams.caption;
    const tags = postParams.tags;
    const category = postParams.category;

    const updateData: Partial<{ name?: string; caption?: string }> = {};
    if (name) updateData.name = name;
    if (caption) updateData.caption = caption;
    const [updateCount] = await this.postModel.update(updateData, {
      where: { id },
    });
    if (tags || category) {
      const post = await this.postModel.findByPk(id);
      if (tags) {
        const tagNames = await Promise.all(
          tags.map(async (tag) => {
            const [tagName] = await Tag.findOrCreate({ where: { name: tag } });
            return tagName;
          }),
        );
        const tagIds = tagNames.map((tag) => tag.id);
        await post.$set('tags', tagIds);
      }
      if (category) {
        const [categoryName] = await Category.findOrCreate({
          where: { name: category },
        });
        await post.$set('category', categoryName);
      }
    }
    return [updateCount];
  }

  async deletePost(id: number): Promise<void> {
    await this.postModel.destroy({ where: { id: id } });
  }
}
