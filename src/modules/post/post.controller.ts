import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostParamsDto } from './dto/post-params.dto';
import { PaginationRequestDto } from 'src/common/dto';
import { ApiJwtPayload } from 'src/interface/jwt-payload.interface';
import { HttpUser } from 'src/common/decorators';
import { PaginatedPostsResponseDto } from './dto/paginated-posts-res.dto';
import { PostResponseDto } from './dto/post-res.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: '[Get all posts]', description: 'Get all posts' })
  @ApiResponse({ type: PaginatedPostsResponseDto })
  getAllPosts(@Query() dto: PaginationRequestDto) {
    return this.postService.getAllPosts(dto);
  }

  @Post()
  @ApiOperation({ summary: '[Create post]', description: 'Create new post' })
  @ApiResponse({ type: PostResponseDto })
  createPost(
    @Body() postParams: PostParamsDto,
    @HttpUser() user: ApiJwtPayload,
  ) {
    return this.postService.createPost(user.id, postParams);
  }

  @ApiOperation({ summary: '[Update post]', description: 'Update single post' })
  @ApiResponse({ type: PostResponseDto })
  @Patch(':id')
  updatePost(@Param('id') id: string, @Body() postParams: PostParamsDto) {
    return this.postService.updatePost(id, postParams);
  }

  @ApiOperation({ summary: '[Delete post]', description: 'Delete single post' })
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
