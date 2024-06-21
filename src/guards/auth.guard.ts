import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthService } from 'src/modules/auth/jwt.auth.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtAuthService: JwtAuthService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request?.headers?.authorization?.split(' ')[1] ||
      request?.handshake?.headers?.authorization;

    if (!token) {
      throw new UnauthorizedException('User is not found.');
    }
    const tokenData = this.jwtAuthService.verify(token);
    const user = await this.prisma.user.findFirst({
      where: {
        id: tokenData.userId,
      },
    });
    request.user = user;
    return !!user;
  }
}
