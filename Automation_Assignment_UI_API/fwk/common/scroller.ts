
import { Locator, Page } from '@playwright/test';

export class Scroller {
  constructor(private page: Page, private element: Locator) {}

  async scrollToView(): Promise<void> {
    await this.element.scrollIntoViewIfNeeded();
  }
}
