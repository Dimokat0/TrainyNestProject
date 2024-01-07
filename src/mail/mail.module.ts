import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { MailController } from './mail.controller';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [SendgridService, ConfigService],
})
export class MailModule {}
