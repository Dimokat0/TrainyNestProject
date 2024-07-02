import { Request } from 'express';
import { ApiJwtPayload } from '../../interface';

export type HttpRequestWithUser = Request & { user: ApiJwtPayload };
