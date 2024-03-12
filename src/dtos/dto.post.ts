import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PostParamsDto {
  @ApiProperty({ example: 'name' })
  name: string;
  @ApiPropertyOptional({ example: 'caption' })
  caption?: string;
  @ApiPropertyOptional({ example: ['tag1', 'tag2'] })
  tags?: string[];
  @ApiProperty({ example: 'category' })
  category?: string;
}
