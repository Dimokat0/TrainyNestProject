import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationRequestDto {
  @ApiProperty({ type: Number, default: 1, description: 'Page number' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ type: Number, default: 10, description: 'Page size' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
