import { expect, Page, Locator } from '@playwright/test';

export class CreateBotModal {
  private readonly modalContainer: Locator;
  readonly titleHeader: Locator;
  readonly nameField: Locator;
  readonly descriptionField: Locator;
  readonly createAndEditButton: Locator;
  readonly cancelButton: Locator;

  constructor(private page: Page) {
    this.modalContainer = page.locator('.modal-form__content');

    this.titleHeader = this.modalContainer.locator('.rio-header__label');
    this.nameField = this.modalContainer.locator('input[name="name"]');
    this.descriptionField = this.modalContainer.locator('input[name="description"]');
    this.createAndEditButton = this.modalContainer.getByRole('button', { name: /Create & edit/i });
    this.cancelButton = this.modalContainer.getByRole('button', { name: 'Cancel' });
  }

  async waitForModalToAppear(expectedTitle?: string) {
    await expect(this.modalContainer).toBeVisible();
    if (expectedTitle) {
      const matchingHeader = this.modalContainer
        .locator('.rio-header__label')
        .filter({ hasText: expectedTitle });
      await expect(matchingHeader).toBeVisible({ timeout: 5000 });
    }
  }
  

  async enterBotDetails(name: string, description?: string) {
    await this.nameField.fill(name);
    if (description) {
      await this.descriptionField.fill(description);
    }
  }

  async submitBotCreation() {
    await this.createAndEditButton.click();
  }

  async cancelCreation() {
    await this.cancelButton.click();
  }
}
