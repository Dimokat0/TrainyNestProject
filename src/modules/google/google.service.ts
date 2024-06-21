import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GoogleRepository } from './google.repository';

@Injectable()
export class GoogleService {
  constructor(private readonly repository: GoogleRepository) {}
  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Unathorized!');
    }
    return await this.repository.verifyUser(req.user);
  }
}
