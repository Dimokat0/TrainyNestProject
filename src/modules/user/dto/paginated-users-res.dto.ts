import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestDto } from 'src/common/dto';
import { UserResponseDto } from 'src/common/dto/user-res.dto';

export class PaginatedUsersResponseDto extends PaginationRequestDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];
}
