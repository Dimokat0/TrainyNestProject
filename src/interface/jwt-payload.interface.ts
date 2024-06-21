import { JwtPayload } from 'jsonwebtoken';
import { rolesEnum } from '@prisma/client';

export interface ApiJwtPayload extends JwtPayload {
  id?: string;
  email?: string;
  username?: string;
  role?: rolesEnum;
}
