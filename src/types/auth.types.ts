import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    userId: string;
    email: string;
    roleId: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  iat?: number;
  exp?: number;
}
