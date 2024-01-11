import { Controller, Post, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { MailOptionsDto } from 'src/dtos/dto.mail';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('mail')
export class MailController {
  constructor(private readonly sendgridService: SendgridService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
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
