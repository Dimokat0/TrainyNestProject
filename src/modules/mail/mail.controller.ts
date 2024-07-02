import { Controller, Post, Body } from '@nestjs/common';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { ApiOperation } from '@nestjs/swagger';
import { MailOptionsDto } from './dto/mail-options.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly sendgridService: SendgridService) {}

  @ApiOperation({
    summary: '[Send email]',
    description: 'Send single email',
  })
  @Post('send-email')
  async sendEmail(@Body() mailOptions: MailOptionsDto) {
    mailOptions = new MailOptionsDto(mailOptions);
    const mail = {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
      text: mailOptions.text,
      html: mailOptions.html,
    };
    return await this.sendgridService.send(mail);
  }
}
