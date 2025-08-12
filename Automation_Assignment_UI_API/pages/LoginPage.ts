import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  readonly pageElements = {
    usernameInput: this.page.locator('input[name="username"]'),
    passwordInput: this.page.locator('input[name="password"]'),
    loginButton: this.page.getByRole('button', { name: 'Log in' }),
    automationTab: this.page.getByText('WELCOME TO AUTOMATION'), // Adjust based on actual post-login element
  };

  async login(email?: string, password?: string): Promise<void> {
    const userEmail = email || process.env.DEFAULT_USER!;
    const userPassword = password || process.env.DEFAULT_PASS!;

    await this.page.goto(process.env.BASE_URL!);
    await this.pageElements.usernameInput.fill(userEmail);
    await this.pageElements.passwordInput.fill(userPassword);
    await this.page.waitForTimeout(3000);
    await this.pageElements.loginButton.click();
    await expect(this.pageElements.automationTab).toBeVisible({ timeout: 10000 });
  }
}
