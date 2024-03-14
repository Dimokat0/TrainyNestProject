import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async setOtp(phone: string, otp: string) {
    await this.client.set(phone, otp, 'EX', 300); // OTP expires after 5 minutes
  }

  async getOtp(phone: string): Promise<string> {
    return this.client.get(phone);
  }
}
