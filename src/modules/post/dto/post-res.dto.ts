import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { post } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';

export class AuthorDto {
  @ApiProperty({ example: 'string' })
  @Expose()
  id: string;
  @ApiProperty({ example: 'Alex' })
  @Expose()
  username: string;
}

export class PostResponseDto {
  @ApiProperty({ example: 'Post title', description: 'Post title' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Post content', description: 'Post content' })
  @Expose()
  content: string;

  @ApiPropertyOptional({ example: 'Sports' })
  @Expose()
  category?: string;

  @ApiPropertyOptional({ type: Array<string> })
  @Expose()
  tags?: string[];

  @ApiProperty({ example: '2021-01-01' })
  @Expose()
  updatedAt: string;

  @ApiProperty({ type: AuthorDto })
  @Expose()
  author: AuthorDto;

  @ApiProperty()
  @ApiPropertyOptional({ type: Array<PostResponseDto> })
  @Expose()
  comments?: PostResponseDto[];

  public static mapFrom(data: post): PostResponseDto {
    return plainToClass(PostResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
