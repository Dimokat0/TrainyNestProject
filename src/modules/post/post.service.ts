import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostParamsDto } from './dto/post-params.dto';
import { PaginationRequestDto } from 'src/common/dto';
import { PostResponseDto } from './dto/post-res.dto';
import { PaginatedPostsResponseDto } from './dto/paginated-posts-res.dto';
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts(dto: PaginationRequestDto): Promise<PaginatedPostsResponseDto> {
    return this.postRepository.getAllPosts(dto);
  }

  createPost(
    userId: string,
    postParams: PostParamsDto,
  ): Promise<PostResponseDto> {
    return this.postRepository.createPost(userId, postParams);
  }

  updatePost(id: string, postParams: PostParamsDto): Promise<PostResponseDto> {
    return this.postRepository.updatePost(id, postParams);
  }

  deletePost(id: string): Promise<void> {
    return this.postRepository.deletePost(id);
  }
}
