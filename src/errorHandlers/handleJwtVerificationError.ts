import { Response } from 'express';

export function handleJwtVerificationError(res: Response, error: any) {
  return res.status(401).json({
    status: 'Error',
    message: 'JWT verification failed',
    error: error.message,
  });
}