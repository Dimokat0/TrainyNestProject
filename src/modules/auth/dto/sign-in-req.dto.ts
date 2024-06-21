import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({ examples: ['Alex', 'alex@gmail.com'] })
  @IsString()
  usernameOrMail: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  password: string;
}
