// pages/FormPage.ts
import { Page, expect, Locator, FrameLocator } from '@playwright/test';
import { CreateBotModal } from './CreateBotModal';
import { TaskBotCanvasPage } from './TaskBotCanvasPage';

type PaletteItem =
  | 'Label' | 'Text Box' | 'Dropdown' | 'Date' | 'Button'
  | 'Select File' | 'Checkbox' | 'Radio Button' | 'Document'
  | 'Image' | 'Table' | 'Text Area' | 'BlankSpace' | 'Row' | 'Time';

export class FormPage {
  constructor(private readonly page: Page) {
    this.createBotModal = new CreateBotModal(page);
    this.canvasPage = new TaskBotCanvasPage(page);
  }

  private readonly createBotModal: CreateBotModal;
  private readonly canvasPage: TaskBotCanvasPage;

  private get frame(): FrameLocator {
    return this.page.frameLocator('iframe');
  }

  private readonly paletteMap: Record<PaletteItem, Locator> = {
    'BlankSpace': this.frame.locator('[data-item-name="BlankSpace"]'),
    'Row': this.frame.locator('[data-item-name="Column"]'),
    'Button': this.frame.locator('[data-item-name="Button"]'),
    'Checkbox': this.frame.locator('[data-item-name="CheckBoxGroup"]'),
    'Date': this.frame.locator('[data-item-name="Date"]'),
    'Document': this.frame.locator('[data-item-name="Document"]'),
    'Dropdown': this.frame.locator('[data-item-name="Dropdown"]'),
    'Image': this.frame.locator('[data-item-name="Image"]'),
    'Label': this.frame.locator('[data-item-name="Label"]'),
    'Radio Button': this.frame.locator('[data-item-name="RadioButtonGroup"]'),
    'Select File': this.frame.locator('[data-item-name="File"]'),
    'Table': this.frame.locator('[data-item-name="Table"]'),
    'Text Area': this.frame.locator('[data-item-name="TextArea"]'),
    'Text Box': this.frame.locator('[data-item-name="TextBox"]'),
    'Time': this.frame.locator('[data-item-name="Time"]'),
  };

  readonly pageElements = {
    // main shell
    createButton: this.page.getByRole('button', { name: 'Create' }),
    FormButton: this.page.getByRole('button', { name: 'Form' }),
    FormName: (name: string) => this.page.getByText(new RegExp(`^${name}$`, 'i')).first(),

    // builder (iframe)
    formCanvas: this.frame.locator('.formcanvas__leftpane'),
    formCanvasDropBar: this.frame.locator('.formcanvas__leftpane .formcanvas-dropzone-bar'),
    formTitleInput: this.frame.getByLabel('Form name', { exact: true }),
    saveButton: this.frame.getByRole('button', { name: 'Save' }),


    paletteSectionFormBtn: this.frame.locator('.editor-palette-section__header-button[aria-label="Form"]'),
    paletteContainer: this.frame.locator('.editor-layout__palette'),
  };


  async createNewForm(name: string): Promise<void> {
    await this.pageElements.createButton.click();
    await this.pageElements.FormButton.click();
    await this.createBotModal.waitForModalToAppear('Create form');
    await this.createBotModal.enterBotDetails(name);
    await this.createBotModal.submitBotCreation();
    await expect(this.pageElements.FormName(name)).toBeVisible({ timeout: 10_000 });
    await expect(this.pageElements.formCanvas).toBeVisible({ timeout: 15_000 });
  }

  async setFormTitle(title: string): Promise<void> {
    await this.pageElements.formTitleInput.fill(title);
    await expect(this.pageElements.formTitleInput).toHaveValue(title);
  }

  /** Expand the "Form" palette if collapsed and ensure it’s in view. */
  async ensurePaletteExpanded(): Promise<void> {
    const btn = this.pageElements.paletteSectionFormBtn;
    if (await btn.count()) {
      const expanded = await btn.getAttribute('aria-expanded');
      if (expanded !== 'true') await btn.click();
    }
    await this.pageElements.paletteContainer.first().scrollIntoViewIfNeeded();
  }

  async addElementToCanvas(item: PaletteItem, offsetY = 32): Promise<void> {
    const source = this.draggableOf(item);
    const target = await this.getDropTarget(); // pick ONE target (strict mode safe)

    await source.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();
    await expect(source).toBeVisible({ timeout: 10_000 });
    await expect(target).toBeVisible({ timeout: 10_000 });

    await this.robustDragAndDrop(source, target, { dy: offsetY });
  }

  async addElements(items: PaletteItem[], gap = 48): Promise<void> {
    let y = gap;
    for (const it of items) {
      await this.addElementToCanvas(it, y);
      y += gap;
    }
  }

  async saveFormAndValidate(): Promise<void> {
    await this.pageElements.saveButton.click();
    await expect(this.pageElements.formCanvas).toBeVisible();
  }

      
  async expectCanvasHasElement(item :String): Promise<void> {
    await expect(
      this.frame.locator(`.formcanvas__leftpane div[data-label="${item}"]`).first()
    ).toBeVisible({ timeout: 5000 });
  }
     



  private draggableOf(item: PaletteItem): Locator {
    const root = this.paletteMap[item];
    return root
      .locator('.editor-palette-item__child--is_draggable')
      .or(root.locator('.editor-palette-item__child-icon'))
      .first();
  }


  private async getDropTarget(): Promise<Locator> {
    const dropBar = this.pageElements.formCanvasDropBar.first();
    try {
      if (await dropBar.isVisible({ timeout: 1000 })) return dropBar;
    } catch {
      
    }
    return this.pageElements.formCanvas.first();
  }


  private async robustDragAndDrop(
    source: Locator,
    target: Locator,
    offset?: { dx?: number; dy?: number }
  ): Promise<void> {
    const { dx = 0, dy = 0 } = offset ?? {};

  
    try {
      await source.dragTo(target, {
        timeout: 10_000,
        targetPosition: { x: 24 + dx, y: 18 + dy },
      });
      return;
    } catch {}

   
    try {
      const s = await source.boundingBox();
      const t = await target.boundingBox();
      if (!s || !t) throw new Error('No bounding boxes');

      const start = { x: s.x + s.width / 2, y: s.y + s.height / 2 };
      const end = { x: t.x + 24 + dx, y: t.y + 18 + dy };

      await this.page.mouse.move(start.x, start.y);
      await this.page.mouse.down();
      await this.page.mouse.move((start.x + end.x) / 2, (start.y + end.y) / 2);
      await this.page.mouse.move(end.x, end.y);
      await this.page.mouse.up();
      return;
    } catch {}


    const src = await source.elementHandle();
    const dst = await target.elementHandle();
    expect(src).toBeTruthy();
    expect(dst).toBeTruthy();

    await this.page.evaluate(
      (args) => {
        const [srcEl, dstEl] = args as Element[];
        const dt = new DataTransfer();
        const fire = (el: Element, type: string) => {
          const ev = new Event(type, { bubbles: true, cancelable: true }) as any;
          (ev as any).dataTransfer = dt;
          el.dispatchEvent(ev);
        };
        fire(srcEl, 'dragstart');
        fire(dstEl, 'dragenter');
        fire(dstEl, 'dragover');
        fire(dstEl, 'drop');
        fire(srcEl, 'dragend');
      },
      [src, dst] as any
    );
  }
}
