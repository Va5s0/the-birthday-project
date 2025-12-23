import { Page, expect } from '@playwright/test';

export class EditContactModal {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private modal = () => this.page.getByRole('dialog');
  private firstNameInput = () => this.page.getByLabel(/first name/i);
  private lastNameInput = () => this.page.getByLabel(/last name/i);
  private mobileInput = () => this.page.getByLabel(/mobile/i);
  private phoneInput = () => this.page.getByLabel(/^phone$/i);
  private emailInput = () => this.page.getByLabel(/email/i);
  private birthdayInput = () => this.page.getByLabel(/birthday/i);
  private saveButton = () => this.page.getByRole('button', { name: /save/i }).last();
  private closeButton = () => this.page.locator('[data-testid="CloseIcon"]').first();
  private errorMessage = () => this.page.locator('[class*="error"]');

  // Actions
  async clearAndFillFirstName(firstName: string) {
    await this.firstNameInput().clear();
    await this.firstNameInput().fill(firstName);
  }

  async clearAndFillLastName(lastName: string) {
    await this.lastNameInput().clear();
    await this.lastNameInput().fill(lastName);
  }

  async clearAndFillMobile(mobile: string) {
    await this.mobileInput().clear();
    await this.mobileInput().fill(mobile);
  }

  async clearAndFillEmail(email: string) {
    await this.emailInput().clear();
    await this.emailInput().fill(email);
  }

  async updateContact(data: {
    firstName?: string;
    lastName?: string;
    mobile?: string;
    email?: string;
  }) {
    if (data.firstName) {
      await this.clearAndFillFirstName(data.firstName);
    }

    if (data.lastName) {
      await this.clearAndFillLastName(data.lastName);
    }

    if (data.mobile) {
      await this.clearAndFillMobile(data.mobile);
    }

    if (data.email) {
      await this.clearAndFillEmail(data.email);
    }

    await this.saveButton().click();
    await this.waitForModalToClose();
  }

  async close() {
    await this.closeButton().click();
  }

  async waitForModalToOpen() {
    await expect(this.modal()).toBeVisible({ timeout: 5000 });
  }

  async waitForModalToClose() {
    await expect(this.modal()).not.toBeVisible({ timeout: 5000 });
  }

  // Assertions
  async expectModalOpen() {
    await expect(this.modal()).toBeVisible();
  }

  async expectModalClosed() {
    await expect(this.modal()).not.toBeVisible();
  }

  async expectFirstNameValue(value: string) {
    await expect(this.firstNameInput()).toHaveValue(value);
  }

  async expectError(message?: string) {
    await expect(this.errorMessage()).toBeVisible();
    if (message) {
      await expect(this.errorMessage()).toContainText(message);
    }
  }
}
