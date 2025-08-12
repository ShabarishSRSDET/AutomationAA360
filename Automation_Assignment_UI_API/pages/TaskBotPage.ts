import { Page, expect } from '@playwright/test';
import { CreateBotModal } from './CreateBotModal';
import { TaskBotCanvasPage } from './TaskBotCanvasPage';

export class TaskBotPage {
  constructor(private page: Page) {
    this.createBotModal = new CreateBotModal(page);
    this.canvasPage = new TaskBotCanvasPage(page);
  }

  private readonly createBotModal: CreateBotModal;
  private readonly canvasPage: TaskBotCanvasPage;

  private readonly actionMap: Record<string, string[]> = {
    'Message Box': ['Message Box'],
    'Delay': ['Wait'],
    'Comment': ['Add comment', 'Comment block'],
  };

  readonly pageElements = {
    createButton: this.page.getByRole('button', { name: 'Create' }),
    taskBotButton: this.page.getByRole('button', { name: 'Task Bot' }),
    botName: (name: string) => this.page.getByText(new RegExp(`^${name}$`, 'i')).first(),

    searchActionsInput: this.page.getByPlaceholder('Search actions'),
    actionItem: (name: string) =>
      this.page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') }),

    messageBoxTitleInput: this.page.locator('[data-name="title"] [contenteditable="true"]'),
    messageBoxContentInput: this.page.locator('[data-name="content"] [contenteditable="true"]'),

    saveButton: this.page.getByRole('button', { name: 'Save' }),
    
  };
  async createButton() {
    await this.pageElements.createButton.click()
  }
  async createNewTaskBot(botName: string): Promise<void> {
    await this.pageElements.createButton.click();
    await this.pageElements.taskBotButton.click();

    await this.createBotModal.waitForModalToAppear('Create Task Bot');
    await this.createBotModal.enterBotDetails(botName);
    await this.createBotModal.submitBotCreation();

    await expect(this.pageElements.botName(botName)).toBeVisible({ timeout: 5000 });
  }

  async addAction(commandName: string, subCommandName?: string): Promise<void> {
    const subCommands = this.actionMap[commandName];
    if (!subCommands || subCommands.length === 0) {
      throw new Error(`No sub-commands configured for: ${commandName}`);
    }

    const selectedSubCommand = subCommandName ?? subCommands[0];

    if (!subCommands.includes(selectedSubCommand)) {
      throw new Error(
        `Invalid sub-command "${selectedSubCommand}" for command "${commandName}". Available: ${subCommands.join(', ')}`
      );
    }

    await this.selectCommandWithSubCommand(commandName, selectedSubCommand);
  }

  private async selectCommandWithSubCommand(commandName: string, subCommandName: string): Promise<void> {
    await this.pageElements.searchActionsInput.fill(commandName);

    const group = this.page.getByRole('button', {
      name: new RegExp(`^${commandName}$`, 'i'),
    });

    await expect(group).toBeVisible();
    const isExpanded = await group.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await group.click();
    }

    const subCommand = this.page.getByRole('button', {
      name: new RegExp(`^${subCommandName}$`, 'i'),
    });
    await subCommand.dblclick();
  }

  async addMessageBox(title: string, message: string): Promise<void> {
    await this.addAction('Message Box');

    await expect(this.pageElements.messageBoxTitleInput).toBeVisible();
    await this.pageElements.messageBoxTitleInput.fill(title);
    await this.pageElements.messageBoxContentInput.fill(message);

    await expect(this.pageElements.messageBoxTitleInput).toHaveText(title);
    await expect(this.pageElements.messageBoxContentInput).toHaveText(message);
  }
  async saveTaskAndValidateFlow(expectedNodeName: string, expectedLabelText: string): Promise<void> {
    await this.pageElements.saveButton.click();

    await this.canvasPage.validateNodePresence(expectedNodeName);
    await this.canvasPage.validateNodeLabelText(expectedNodeName, expectedLabelText);
    await this.page.waitForTimeout(2000);
  }
}
