import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug'])
    .default('info'),
  ALLOWED_ORIGINS: z.string().default('*'),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
});

const parseEnv = () => {
  try {
    // add logger
    return envSchema.parse(process.env);
  } catch (error) {
    // add logger...
    process.exit(1);
  }
};

export const env = parseEnv();

export default env;
