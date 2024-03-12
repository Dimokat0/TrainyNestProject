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
import { ApiOperation } from '@nestjs/swagger';
import { RolesEnum } from 'src/enums/roles.enum';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ summary: '[Get all posts]', description: 'Get all posts' })
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  @ApiOperation({ summary: '[Create post]', description: 'Create new post' })
  createPost(
    @Headers('authorization') access_token: string,
    @Body() postParams: PostParamsDto,
  ) {
    return this.postService.createPost(access_token, postParams);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN])
  @ApiOperation({ summary: '[Update post]', description: 'Update single post' })
  @Patch(':id')
  updatePost(@Param('id') id: number, @Body() postParams: PostParamsDto) {
    return this.postService.updatePost(id, postParams);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN])
  @ApiOperation({ summary: '[Delete post]', description: 'Delete single post' })
  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postService.deletePost(id);
  }
}
