import express, { Express } from 'express';
import bodyParser from 'body-parser';

const addThirdPartyMiddleware = (app: Express): Express => {
  // Third-party middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.json());

  return app;
};

export default addThirdPartyMiddleware;
