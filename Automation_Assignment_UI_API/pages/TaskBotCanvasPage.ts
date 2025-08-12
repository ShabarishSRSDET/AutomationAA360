import { Page, Locator, expect } from '@playwright/test';

export class TaskBotCanvasPage {
  constructor(private readonly page: Page) {}
  private canvasNode = (nodeName: string): Locator =>
    this.page.locator('.taskbot-canvas-flow-point__label--name', { hasText: nodeName });

  async validateNodePresence(nodeName: string) {
    const node = this.canvasNode(nodeName);
    await expect(node).toBeVisible({ timeout: 5000 });
  }

  async validateNodeLabelText(nodeName: string, labelText: string) {
    const node = this.canvasNode(nodeName);
    await expect(node).toBeVisible();
    const labelLocator = node.locator('..').locator('.taskbotnodelabel');
    const expectedPattern = new RegExp(`^${nodeName}\\s+“${labelText}”$`, 'i');
    await expect(labelLocator).toHaveAttribute('data-label', expectedPattern);
    
  }
}
