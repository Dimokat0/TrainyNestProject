import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { User } from 'src/user/user.model';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { MailController } from './mail.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
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
