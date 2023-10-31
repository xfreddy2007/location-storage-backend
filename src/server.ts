import express, { Express } from 'express';
import addThirdPartyMiddleware from './middleware/third-party';
import addRoutes from './routes';

const app: Express = express();

// Third Party Middleware
addThirdPartyMiddleware(app);

// Routes
addRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
