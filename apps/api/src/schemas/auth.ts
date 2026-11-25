import { z } from 'zod';

export const RegisterUser = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(12).max(128),
});

export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.string(),
});
