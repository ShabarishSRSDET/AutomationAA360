import { request, APIRequestContext } from '@playwright/test';

export class ApiClient {
  private ctx!: APIRequestContext;

  constructor(private readonly baseURL: string) {}

  async init(extra: Record<string, string> = {}) {
    this.ctx = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json', ...extra },
    });
  }

  get context() {
    if (!this.ctx) throw new Error('ApiClient not initialized');
    return this.ctx;
  }

  async dispose() {
    await this.ctx?.dispose();
  }
}
