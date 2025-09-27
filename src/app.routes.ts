import { Router, Request, Response } from 'express';

import userRoutes from './modules/users/user.routes';
import env from './config/env';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to threat intelligence platform',
  });
});

router.get('/health', (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime().toFixed(),
      environment: env.NODE_ENV,
      version: '1.0.0',
    },
  });
});

router.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

export default router;
