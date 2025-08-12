import { expect, APIResponse } from '@playwright/test';
import { ZodSchema } from 'zod';

export async function expectStatus(res: APIResponse, codes: number[] | number) {
  const allowed = Array.isArray(codes) ? codes : [codes];
  expect(allowed, `Unexpected status ${res.status()}`).toContain(res.status());
}

export async function expectSchema<T>(res: APIResponse, schema: ZodSchema<T>) {
  const json = await res.json();
  const parsed = schema.safeParse(json);
  expect(parsed.success, JSON.stringify(parsed, null, 2)).toBe(true);
  return json as T;
}

export async function expectUnder(ms: number, limit: number, label: string) {
  expect(ms, `${label} took ${ms}ms (> ${limit}ms)`).toBeLessThan(limit);
}

export async function timed<T>(fn: () => Promise<T>) {
  const t0 = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - t0 };
}
