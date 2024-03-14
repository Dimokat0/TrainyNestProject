import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PostParamsDto } from 'src/dtos/dto.post';
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts() {
    return this.postRepository.getAllPosts();
  }

  createPost(access_token: string, postParams: PostParamsDto) {
    return this.postRepository.createPost(access_token, postParams);
  }

  updatePost(id: number, postParams: PostParamsDto) {
    return this.postRepository.updatePost(id, postParams);
  }

  deletePost(id: number) {
    return this.postRepository.deletePost(id);
  }
}
