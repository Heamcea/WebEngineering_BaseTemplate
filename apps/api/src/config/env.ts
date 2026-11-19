import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_VERSION: z.string().default('dev'),
});

export const env = EnvSchema.parse(process.env);
