import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendgridService } from 'src/modules/sendgrid/sendgrid.service';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bull';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [MailController],
  providers: [SendgridService, ConfigService, PrismaService, UserService],
  exports: [SendgridService],
})
export class MailModule {}
