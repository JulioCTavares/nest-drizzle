import { eq, gte, ilike, lte } from 'drizzle-orm';

export type Condition = ReturnType<
  typeof eq | typeof gte | typeof lte | typeof ilike
>;
