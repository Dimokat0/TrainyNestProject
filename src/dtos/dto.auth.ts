import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserParamsDto {
  @ApiPropertyOptional({ example: 'username' })
  username?: string;
  @ApiPropertyOptional({ example: 'password' })
  password?: string;
  @ApiPropertyOptional({ examples: [1, 2, 3] })
  roleId?: number;
}

export class NewAccessTokenResultDto {
  @ApiProperty({ example: true })
  success: boolean;
  @ApiProperty({ example: 'string' })
  accessToken?: string;
}
