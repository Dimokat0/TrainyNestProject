import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Alex' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '380123456789' })
  @IsOptional()
  @IsNumberString()
  phone?: string;
}
