import express, { Express } from 'express';
import addThirdPartyMiddleware from './middleware/third-party';
import addRoutes from './routes';
import 'dotenv/config';
import dbConnection from './db';

const app: Express = express();

// Third Party Middleware
addThirdPartyMiddleware(app);

// Routes
addRoutes(app);

// Connect to MongoDB
dbConnection();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
