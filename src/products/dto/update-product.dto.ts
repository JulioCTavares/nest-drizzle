import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  team: z.string().optional(),
  year: z.number().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
