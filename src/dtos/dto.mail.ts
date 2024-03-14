import { ConfigService } from '@nestjs/config';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MailOptionsDto {
  @ApiProperty({ example: 'example@mail.com' })
  to: string;
  @ApiPropertyOptional({ example: 'subject' })
  subject?: string;
  @ApiProperty({ example: 'example@mail.com' })
  from: string;
  @ApiProperty({ example: 'text' })
  text: string;
  @ApiProperty({ example: '<h1>HTML</h1>' })
  html?: string;

  constructor(partial: Partial<MailOptionsDto>, configService?: ConfigService) {
    this.to = partial.to;
    this.subject = partial.subject || 'Trainy Project notification';
    this.from = partial.from || configService.get<string>('SENDGRID_MAIL');
    this.text = partial.text || 'This is no-reply e-mail.';
    this.html = partial.html;
  }
}
