import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailOptionsDto } from 'src/dtos/dto.mail';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) {}

  async addMailToQueue(mailOptions: MailOptionsDto) {
    mailOptions = new MailOptionsDto(mailOptions);
    await this.mailQueue.add('sendMail', mailOptions);
  }
}
