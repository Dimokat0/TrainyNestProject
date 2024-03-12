import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Role } from './role/role.model';

const ensureRoles = async () => {
  const roles = ['member', 'admin', 'superAdmin'];

  for (const role of roles) {
    await Role.findOrCreate({ where: { name: role } });
  }
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  const config = new DocumentBuilder()
    .setTitle('Docs')
    .setDescription('Trainy project API')
    .setVersion('0.1')
    .addTag('trainyProj')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const sequelize = app.get(Sequelize);
  sequelize.sync().then(() => {
    ensureRoles().catch(console.error);
  });

  await app.listen(3000);
}

console.log('Starting server on http://localhost:3000');
bootstrap();
