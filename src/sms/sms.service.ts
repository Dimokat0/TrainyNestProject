import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('TWILIO_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(to: string, body: string) {
    await this.client.messages.create({
      body: body,
      from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
      to: to,
    });
  }
}
