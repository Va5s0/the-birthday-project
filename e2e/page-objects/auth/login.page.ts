import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class LoginPage extends BasePage {
  // Locators
  private emailInput = () => this.page.getByLabel(/email/i);
  private passwordInput = () => this.page.getByLabel(/password/i);
  private loginButton = () => this.page.getByRole('button', { name: /login/i });
  private signupButton = () => this.page.getByRole('button', { name: /sign up/i });
  private forgotPasswordLink = () => this.page.getByText(/forgot password/i);
  private errorMessage = () => this.page.locator('[role="alert"]');

  constructor(page: Page) {
    super(page);
  }

  // Actions
  async navigate() {
    await this.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink().click();
  }

  async switchToSignup() {
    await this.signupButton().click();
  }

  // Assertions
  async expectLoginError(message?: string) {
    await expect(this.errorMessage()).toBeVisible({ timeout: 5000 });
    if (message) {
      await expect(this.errorMessage()).toContainText(message);
    }
  }

  async expectToBeOnLoginPage() {
    await this.expectToBeOnPage('/login');
  }

  async expectLoginButtonDisabled() {
    await expect(this.loginButton()).toBeDisabled();
  }

  async expectLoginButtonEnabled() {
    await expect(this.loginButton()).toBeEnabled();
  }
}
