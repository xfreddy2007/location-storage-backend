import express, { Express } from 'express';
import bodyParser from 'body-parser';
import addRoutes from './routes';

const app: Express = express();

// Third-party middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Routes
addRoutes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
