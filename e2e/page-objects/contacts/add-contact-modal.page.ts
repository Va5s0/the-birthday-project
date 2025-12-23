import { Page, expect } from '@playwright/test';

export class AddContactModal {
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
  private submitButton = () => this.page.getByRole('button', { name: /save|add/i }).last();
  private closeButton = () => this.page.locator('[data-testid="CloseIcon"]').first();
  private errorMessage = () => this.page.locator('[class*="error"]');

  // Actions
  async fillFirstName(firstName: string) {
    await this.firstNameInput().fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput().fill(lastName);
  }

  async fillMobile(mobile: string) {
    await this.mobileInput().fill(mobile);
  }

  async fillPhone(phone: string) {
    await this.phoneInput().fill(phone);
  }

  async fillEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async fillBirthday(date: Date) {
    // Format date as MM/DD/YYYY for the date input
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    await this.birthdayInput().click();
    await this.birthdayInput().fill(formattedDate);
  }

  async fillContactForm(data: {
    firstName: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
    email?: string;
    birthday?: Date;
  }) {
    await this.fillFirstName(data.firstName);

    if (data.lastName) {
      await this.fillLastName(data.lastName);
    }

    if (data.mobile) {
      await this.fillMobile(data.mobile);
    }

    if (data.phone) {
      await this.fillPhone(data.phone);
    }

    if (data.email) {
      await this.fillEmail(data.email);
    }

    if (data.birthday) {
      await this.fillBirthday(data.birthday);
    }
  }

  async submit() {
    await this.submitButton().click();
  }

  async close() {
    await this.closeButton().click();
  }

  async createContact(data: {
    firstName: string;
    lastName?: string;
    mobile?: string;
    phone?: string;
    email?: string;
    birthday?: Date;
  }) {
    await this.fillContactForm(data);
    await this.submit();
    await this.waitForModalToClose();
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

  async expectError(message?: string) {
    await expect(this.errorMessage()).toBeVisible();
    if (message) {
      await expect(this.errorMessage()).toContainText(message);
    }
  }

  async expectSubmitButtonDisabled() {
    await expect(this.submitButton()).toBeDisabled();
  }

  async expectSubmitButtonEnabled() {
    await expect(this.submitButton()).toBeEnabled();
  }
}
