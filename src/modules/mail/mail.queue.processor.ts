import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { MailDataRequired } from '@sendgrid/mail';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly sendgridService: SendgridService) {}

  @Process('sendMail')
  async sendMail(job: Job<MailDataRequired>) {
    const { data } = job;
    await this.sendgridService.send(data);
  }
}
