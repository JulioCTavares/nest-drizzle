import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  stock: z.number().positive().default(0),
  team: z.string().optional(),
  year: z.number().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
