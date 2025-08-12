// tests/usecases/aa360.combined.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { SidebarPage } from '../../pages/SidebarPage';
import { TaskBotPage } from '../../pages/TaskBotPage';
import { FormPage } from '../../pages/FormPage';

test.describe('AA360 UI Automation (TaskBot + FormBuilder)', () => {
  let loginPage: LoginPage;
  let sidebar: SidebarPage;
  let taskBot: TaskBotPage;
  let formPage: FormPage;

  const BotName = `AA 360-${Date.now()}`;
  const FormName = `AA360-Form-${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // POMs on the same page
    loginPage = new LoginPage(page);
    sidebar = new SidebarPage(page);
    taskBot = new TaskBotPage(page);
    formPage = new FormPage(page);

    // Single login for the whole suite
    await loginPage.login();
  });

  test('Use Case 1: Message Box Task (UI Automation) @AA360', async () => {
    await test.step('Navigate to Automation', async () => {
      await sidebar.navigateTo('Automation');
    });

    await test.step('Create new Task Bot', async () => {
      await taskBot.createNewTaskBot(BotName);
    });

    await test.step('Add Message Box action', async () => {
      await taskBot.addMessageBox('Automation Anywhere Enterprise Client AA360', '12345');
    });

    await test.step('Save and validate', async () => {
      await taskBot.saveTaskAndValidateFlow('Message Box', '12345');
    });
  });

  test('Use Case 2: Form Builder (UI Automation) @AA360', async () => {
    await test.step('Navigate to Automation', async () => {
      await sidebar.navigateTo('Automation');
    });

    await test.step('Create a new Form', async () => {
      await formPage.createNewForm(FormName);
      await expect(formPage.pageElements.formCanvas).toBeVisible({ timeout: 5000 });
    });

    await test.step('Ensure palette is expanded', async () => {
      await formPage.ensurePaletteExpanded();
    });

    await test.step('Add form elements to canvas', async () => {
      await formPage.addElements(['Text Box', 'Select File']);
    });

    await test.step('Save form and validate canvas content', async () => {
      await formPage.saveFormAndValidate();
      // Validate something we actually dropped
      
      await formPage.expectCanvasHasElement('TextBox');
      await formPage.expectCanvasHasElement('Select a file');
    });
  });
});
