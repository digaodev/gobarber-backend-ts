import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

// Utils
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing JWT token.', 403);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 403);
  }
}
