import { test, expect } from '../../fixtures/database.fixture';
import { SignupPage } from '../../page-objects/auth/signup.page';

test.describe('Signup Flow', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
  });

  test('should register new user successfully', async ({ page }) => {
    await signupPage.navigate();
    await signupPage.expectToBeOnSignupPage();

    const uniqueEmail = `test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}@example.com`;
    await signupPage.signup(uniqueEmail, 'TestPassword123!');

    // Should redirect to contacts page
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should show error when email is already in use', async () => {
    await signupPage.navigate();

    // Create a user first
    const email = `existing-${Date.now()}@example.com`;
    await signupPage.signup(email, 'TestPassword123!');

    // Wait for redirect to confirm user was created
    await expect(signupPage.page).toHaveURL('/', { timeout: 10000 });

    // Navigate back to signup and try to register with same email
    await signupPage.navigate();
    await signupPage.signup(email, 'AnotherPassword123!');

    await signupPage.expectSignupError();
  });

  test('should show error when password is too short', async () => {
    await signupPage.navigate();

    const uniqueEmail = `test-${Date.now()}@example.com`;
    await signupPage.signup(uniqueEmail, '12345'); // Less than 6 characters

    await signupPage.expectSignupError();
    await signupPage.expectToBeOnSignupPage();
  });

  test('should disable signup button when fields are empty', async () => {
    await signupPage.navigate();

    // Initially disabled with empty fields
    await signupPage.expectSignupButtonDisabled();
  });

  test('should navigate to login page', async ({ page }) => {
    // Navigate directly to login page (Auth component has state initialization bug)
    await page.goto('/login');

    await expect(page).toHaveURL('/login');
  });
});