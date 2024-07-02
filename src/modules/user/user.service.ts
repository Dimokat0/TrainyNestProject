import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PaginationRequestDto, UserResponseDto } from 'src/common/dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-res.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(
    dto: PaginationRequestDto,
  ): Promise<PaginatedUsersResponseDto> {
    const { page, limit } = dto;
    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
    });
    const data = users.map((user) => UserResponseDto.mapFrom(user));
    return {
      page,
      limit,
      data,
    };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} is not found`);
    }
    const response = UserResponseDto.mapFrom(user);
    return response;
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
