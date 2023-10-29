import { Request, Response, NextFunction } from 'express';
import type { CustomErrorType } from '@/types/error';
import { HttpError } from '../../models/http-error';

export const notFoundErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
};

export const apiErrorHandler = (
  error: CustomErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
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
