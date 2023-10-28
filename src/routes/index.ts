import { Express } from 'express';
import { apiErrorHandler } from '../middleware/error-handle';
import placeRouter from './places';

const addRoutes = (app: Express): Express => {
  // user routes
  // places routes
  app.use('/api/places', placeRouter);

  // Error handle
  app.use('/', apiErrorHandler);

  return app;
};

export default addRoutes;
