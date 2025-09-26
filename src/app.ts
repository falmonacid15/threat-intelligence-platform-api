import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middlewares/logger-handler';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use(requestLogger);

app.get('/', async (req, res) => {
  res.json('').status(200);
});

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.use(errorHandler);

export default app;
