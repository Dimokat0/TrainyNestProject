export class MailOptionsDto {
  to: string;
  subject?: string;
  from: string;
  text: string;
  html?: string;

  constructor(partial: Partial<MailOptionsDto>) {
    this.to = partial.to;
    this.subject = partial.subject || 'TrainyProject notification';
    this.from = partial.from || 'holius.dmitriy@gmail.com';
    this.text = partial.text || 'This is no-reply e-mail.';
    this.html = partial.html;
  }
}
