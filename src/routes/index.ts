import { Express } from 'express';
import { apiErrorHandler, notFoundErrorHandler } from '../middleware/error-handle';
import userRouter from './users';
import placeRouter from './places';

const addRoutes = (app: Express): Express => {
  // user routes
  app.use('api/users', userRouter);

  // places routes
  app.use('/api/places', placeRouter);

  // 404 routes handler
  app.use(notFoundErrorHandler);

  // Error handle
  app.use('/', apiErrorHandler);

  return app;
};

export default addRoutes;
