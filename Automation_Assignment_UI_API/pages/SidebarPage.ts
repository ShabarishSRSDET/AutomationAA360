
import { Page, Locator, expect } from '@playwright/test';

export class SidebarPage {
  constructor(private page: Page) {}
  readonly pageElements = {
    home: this.page.getByRole('link', { name: 'Home', exact: true }),
    automation: this.page.getByRole('link', { name: 'Automation', exact: true }),
    ai: this.page.getByRole('link', { name: 'AI', exact: true }),
    activity: this.page.getByRole('link', { name: 'Activity', exact: true }),
    manage: this.page.getByRole('link', { name: 'Manage', exact: true }),
    administration: this.page.getByRole('link', { name: 'Administration', exact: true }),
    explore:this.page.getByRole('link', { name: 'Explore', exact: true }),


  };
  

  async navigateTo(menu: string): Promise<void> {
    const key = menu.toLowerCase() as keyof typeof this.pageElements;
    const target = this.pageElements[key];
  
    if (!target) throw new Error(`❌ Menu "${menu}" not found in SidebarPage`);
  
    await target.click();
  
   
    switch (menu.toLowerCase()) {
      case 'automation':
        await expect(this.page.locator('h1', { hasText: 'Automation' })).toBeVisible();
        break;
      case 'home':
        await expect(this.page.locator('text=Pathfinder Community & Learning Resources')).toBeVisible();
        break;
      case 'activity':
        await expect(this.page.locator('text=In progress')).toBeVisible();
        break;
      case 'explore':
        await expect(this.page.locator('text=Welcome to Automation Anywhere')).toBeVisible();
        break;
      case 'manage':
        await expect(this.page.locator('text=Devices')).toBeVisible();
        break;
      case 'administration':
        await expect(this.page.locator('text=Users')).toBeVisible();
        break;
      default:
        throw new Error(`No confirmation logic defined for menu "${menu}"`);
    }
  }
  
}
