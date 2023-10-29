import { Express } from 'express';
import { apiErrorHandler, notFoundErrorHandler } from '../middleware/error-handle';
import placeRouter from './places';

const addRoutes = (app: Express): Express => {
  // user routes
  // places routes
  app.use('/api/places', placeRouter);

  app.use(notFoundErrorHandler);

  // Error handle
  app.use('/', apiErrorHandler);

  return app;
};

export default addRoutes;
