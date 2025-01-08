import { z } from 'zod';
import { Role } from '../enum/roleEnum';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  role: z
    .string()
    .optional()
    .refine((value) => !value || Object.values(Role).includes(value as Role)),
});

export type RegisterDto = z.infer<typeof registerSchema>;
