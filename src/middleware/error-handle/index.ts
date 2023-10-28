import { Request, Response, NextFunction } from 'express';
import type { APIErrorType } from '@/types/error';

export const apiErrorHandler = (error: APIErrorType, req: Request, res: Response, next: NextFunction) => {
  // if (error) {
  //   res.status(error.status || 500).json({
  //     status: 'error',
  //     message: `${error.name}: ${error.message}`,
  //   });
  // } else {
  //   res.status(500).json({
  //     status: 'error',
  //     message: `${error}`,
  //   });
  // }
  // next(error);

  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred.' });
};
