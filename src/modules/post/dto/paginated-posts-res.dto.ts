import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto';
import { PostResponseDto } from './post-res.dto';

export class PaginatedPostsResponseDto extends PaginationRequestDto {
  @ApiProperty({ type: Array<PostResponseDto> })
  data: PostResponseDto[];
}
