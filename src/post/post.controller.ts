import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  createPost(
    @Body('name') name: string,
    @Body('caption') caption: string,
    @Headers('authorization') access_token: string,
    @Body('tags') tagNames: string[],
    @Body('category') categoryName: string,
  ) {
    return this.postService.createPost(
      name,
      caption,
      access_token,
      tagNames,
      categoryName,
    );
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Patch(':id')
  updatePost(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('caption') caption: string,
    @Body('tags') tagNames: string[],
    @Body('category') categoryName: string,
  ) {
    return this.postService.updatePost(
      id,
      name,
      caption,
      tagNames,
      categoryName,
    );
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
