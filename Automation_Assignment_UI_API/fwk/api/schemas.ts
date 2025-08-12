import { z } from 'zod';

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({ id: z.string().or(z.number()) }).passthrough(),
});
export const LearningInstanceSchema = z.object({
  name: z.string(),
  description: z.string()
}).passthrough();


