# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/home/danhMuc.ui.spec.ts >> Home - Danh mục khóa học >> DANH_MUC_UI_006 - should navigate to Thinking course category page when clicking Tư duy lập trình
- Location: tests/ui/home/danhMuc.ui.spec.ts:141:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('link', { name: 'Tư duy lập trình', exact: true })
    - locator resolved to <a href="/danhmuckhoahoc/TuDuy">Tư duy lập trình</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li class="courseCate">…</li> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li class="courseCate">…</li> intercepts pointer events
    - retrying click action
      - waiting 100ms
    8 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <li class="courseCate">…</li> intercepts pointer events
    - retrying click action
      - waiting 500ms

```

# Test source

```ts
  1  | import type { FrameLocator, Locator, Page } from '@playwright/test';
  2  | 
  3  | export class BasePage {
  4  |   constructor(protected readonly page: Page) {}
  5  | 
  6  |   async goto(url: string): Promise<void> {
  7  |     await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  8  |   }
  9  | 
  10 |   async reload(): Promise<void> {
  11 |     await this.page.reload({ waitUntil: 'domcontentloaded' });
  12 |   }
  13 | 
  14 |   async waitForPageLoaded(): Promise<void> {
  15 |     await this.page.waitForLoadState('domcontentloaded');
  16 |   }
  17 | 
  18 |   async waitForUrl(url: string | RegExp): Promise<void> {
  19 |     await this.page.waitForURL(url);
  20 |   }
  21 | 
  22 |   async click(locator: Locator): Promise<void> {
> 23 |     await locator.click();
     |                   ^ Error: locator.click: Target page, context or browser has been closed
  24 |   }
  25 | 
  26 |   async fill(locator: Locator, value: string): Promise<void> {
  27 |     await locator.fill(value);
  28 |   }
  29 | 
  30 |   async clearAndFill(locator: Locator, value: string): Promise<void> {
  31 |     await locator.clear();
  32 |     await locator.fill(value);
  33 |   }
  34 | 
  35 |   async press(locator: Locator, key: string): Promise<void> {
  36 |     await locator.press(key);
  37 |   }
  38 | 
  39 |   async hover(locator: Locator): Promise<void> {
  40 |     await locator.hover();
  41 |   }
  42 | 
  43 |   async waitForVisible(locator: Locator): Promise<void> {
  44 |     await locator.waitFor({ state: 'visible' });
  45 |   }
  46 | 
  47 |   async waitForHidden(locator: Locator): Promise<void> {
  48 |     await locator.waitFor({ state: 'hidden' });
  49 |   }
  50 | 
  51 |   async isVisible(locator: Locator): Promise<boolean> {
  52 |     return locator.isVisible();
  53 |   }
  54 | 
  55 |   async isEnabled(locator: Locator): Promise<boolean> {
  56 |     return locator.isEnabled();
  57 |   }
  58 | 
  59 |   async getText(locator: Locator): Promise<string> {
  60 |     return (await locator.textContent())?.trim() ?? '';
  61 |   }
  62 | 
  63 |   async getInputValue(locator: Locator): Promise<string> {
  64 |     return locator.inputValue();
  65 |   }
  66 | 
  67 |   async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
  68 |     return locator.getAttribute(attributeName);
  69 |   }
  70 | 
  71 |   async getCurrentUrl(): Promise<string> {
  72 |     return this.page.url();
  73 |   }
  74 | 
  75 |   async getTitle(): Promise<string> {
  76 |     return this.page.title();
  77 |   }
  78 | 
  79 |   async scrollToElement(locator: Locator): Promise<void> {
  80 |     await locator.scrollIntoViewIfNeeded();
  81 |   }
  82 | 
  83 |   async scrollToTop(): Promise<void> {
  84 |     await this.page.evaluate(() => window.scrollTo(0, 0));
  85 |   }
  86 | 
  87 |   async scrollToBottom(): Promise<void> {
  88 |     await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  89 |   }
  90 | 
  91 |   getFrame(selector: string): FrameLocator {
  92 |     return this.page.frameLocator(selector);
  93 |   }
  94 | 
  95 |   async takeScreenshot(): Promise<Buffer> {
  96 |     return this.page.screenshot({ fullPage: true });
  97 |   }
  98 | }
  99 | 
```