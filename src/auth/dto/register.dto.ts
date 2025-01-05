import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  role: z.string().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
