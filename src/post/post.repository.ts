import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { MyJwtPayload } from 'src/auth/auth.repository';
import { Category } from 'src/category/category.model';
import { Tag } from 'src/tags/tag.model';

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
    name: string,
    caption: string,
    access_token: string,
    tagNames: string[],
    categoryName: string,
  ): Promise<Post> {
    const payload = jwt.verify(
      access_token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    ) as MyJwtPayload;
    const authorId = payload.userId;
    const [category] = await Category.findOrCreate({
      where: { name: categoryName },
    });
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        const [tag] = await Tag.findOrCreate({ where: { name } });
        return tag;
      }),
    );
    const tagIds = tags.map((tag) => tag.id);
    const post = await this.postModel.create({
      name,
      caption,
      date: new Date(),
      authorId,
      categoryId: category.id,
    });
    await post.$set('tags', tagIds);
    await post.$set('category', category);
    return post;
  }

  async updatePost(
    id: number,
    name?: string,
    caption?: string,
    tagNames?: string[],
    categoryName?: string,
  ): Promise<[number]> {
    const updateData: Partial<{ name?: string; caption?: string }> = {};
    if (name) updateData.name = name;
    if (caption) updateData.caption = caption;
    const [updateCount] = await this.postModel.update(updateData, {
      where: { id },
    });
    if (tagNames || categoryName) {
      const post = await this.postModel.findByPk(id);
      if (tagNames) {
        const tags = await Promise.all(
          tagNames.map(async (name) => {
            const [tag] = await Tag.findOrCreate({ where: { name } });
            return tag;
          }),
        );
        const tagIds = tags.map((tag) => tag.id);
        await post.$set('tags', tagIds);
      }
      if (categoryName) {
        const [category] = await Category.findOrCreate({
          where: { name: categoryName },
        });
        await post.$set('category', category);
      }
    }
    return [updateCount];
  }

  async deletePost(id: number): Promise<void> {
    await this.postModel.destroy({ where: { id } });
  }
}
