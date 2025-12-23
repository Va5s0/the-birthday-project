import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private emailInput = () => this.page.getByLabel(/email/i);
  private passwordInput = () => this.page.getByLabel(/password/i);
  private signupButton = () => this.page.locator('form').getByRole('button', { name: /sign up/i });
  private loginLink = () => this.page.locator('div').getByRole('button', { name: /login/i }).first();
  private errorSnackbar = () => this.page.locator('[role="alert"]');

  // Actions
  async navigate() {
    await this.goto('/signup');
  }

  async signup(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signupButton().click();
  }

  async clickLoginLink() {
    await this.loginLink().click();
  }

  // Assertions
  async expectToBeOnSignupPage() {
    await this.expectToBeOnPage(/\/signup/);
  }

  async expectSignupError(message?: string) {
    await expect(this.errorSnackbar()).toBeVisible({ timeout: 5000 });
    if (message) {
      await expect(this.errorSnackbar()).toContainText(message);
    }
  }

  async expectSignupButtonDisabled() {
    await expect(this.signupButton()).toBeDisabled();
  }

  async expectSignupButtonEnabled() {
    await expect(this.signupButton()).toBeEnabled();
  }
}
