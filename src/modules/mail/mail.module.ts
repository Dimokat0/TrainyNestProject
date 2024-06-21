import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthMiddleware } from 'src/modules/auth/auth.middleware';
import { SendgridService } from 'src/modules/sendgrid/sendgrid.service';
import { UserModule } from 'src/modules/user/user.module';
import { UserRepository } from 'src/modules/user/user.repository';
import { UserService } from 'src/modules/user/user.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    UserModule,
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  controllers: [MailController],
  providers: [SendgridService, ConfigService, UserService, UserRepository],
  exports: [SendgridService],
})
export class MailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'mail/send-email', method: RequestMethod.POST });
  }
}
