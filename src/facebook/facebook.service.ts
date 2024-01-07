import { Injectable } from '@nestjs/common';
import { FacebookRepository } from './facebook.repository';

@Injectable()
export class FacebookService {
  constructor(private readonly repository: FacebookRepository) {}
  async facebookLogin(req) {
    if (!req.user) {
      return { success: false, message: 'Unathorized' };
    }
    return await this.repository.verifyUser(req.user);
  }
}
