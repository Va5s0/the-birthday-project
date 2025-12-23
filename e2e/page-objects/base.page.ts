import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation methods
  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForNavigation(urlPattern: string | RegExp) {
    await this.page.waitForURL(urlPattern);
  }

  // Common element interactions
  async clickButton(text: string) {
    await this.page.getByRole('button', { name: text }).click();
  }

  async fillInput(label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  }

  async waitForLoadingToFinish() {
    // Wait for any loading spinners or indicators to disappear
    await this.page.waitForLoadState('networkidle');
    const loadingIndicator = this.page.locator('text=Loading');
    if (await loadingIndicator.isVisible().catch(() => false)) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  // Assertions
  async expectToBeOnPage(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  async expectToSeeText(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }
}
