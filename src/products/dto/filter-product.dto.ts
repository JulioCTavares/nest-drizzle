import { z } from 'zod';

export const filterProductsSchema = z.object({
  team: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  year: z.number().int().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type FilterProducts = z.infer<typeof filterProductsSchema>;
