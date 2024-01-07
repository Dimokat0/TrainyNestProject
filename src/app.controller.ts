import { Controller, Get, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  @Get('/')
  main(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'main.html'));
  }

  @Get('/loginPage')
  loginPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'login.html'));
  }

  @Get('/registerPage')
  registerPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'register.html'));
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [2, 3])
  @Get('/manageUsersPage')
  manageUsersPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'manage_users.html'));
  }

  @Get('/postsPage')
  posts(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'posts.html'));
  }
}
