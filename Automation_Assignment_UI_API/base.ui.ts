
import { Page } from '@playwright/test';
import { Reporter } from './fwk/common/reporter';

export class BaseUi {
  protected page: Page;
  protected report: Reporter;

  constructor(page: Page) {
    this.page = page;
    this.report = new Reporter();
  }

  async waitFor(timeout: number) {
    await this.page.waitForTimeout(timeout);
  }
}
