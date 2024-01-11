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
import { PostParamsDto } from 'src/dtos/dto.post';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  createPost(
    @Headers('authorization') access_token: string,
    @Body() postParams: PostParamsDto,
  ) {
    return this.postService.createPost(access_token, postParams);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Patch(':id')
  updatePost(@Param('id') id: number, @Body() postParams: PostParamsDto) {
    return this.postService.updatePost(id, postParams);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
