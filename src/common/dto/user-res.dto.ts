import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { plainToClass, Expose } from 'class-transformer';
import { user } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ example: 'Alex' })
  @Expose()
  username: string;

  @ApiPropertyOptional({ example: '380123456789' })
  @IsOptional()
  @Expose()
  phone?: string;

  @ApiProperty({ description: 'Access Token' })
  @IsOptional()
  @IsString()
  @Expose()
  accessToken?: string;

  public static mapFrom(data: user): UserResponseDto {
    return plainToClass(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
