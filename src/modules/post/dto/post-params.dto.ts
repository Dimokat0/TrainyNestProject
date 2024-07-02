import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class PostParamsDto {
  @ApiProperty({ example: 'Post title', description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Post content', description: 'Post content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'Sports' })
  @IsString()
  category: string;

  @ApiPropertyOptional({ type: Array<string> })
  @IsArray()
  tags: string[];
}
