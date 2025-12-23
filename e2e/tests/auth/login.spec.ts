import { test, expect } from '../../fixtures/database.fixture';
import { LoginPage } from '../../page-objects/auth/login.page';
import { createTestUser } from '../../helpers/api-helpers';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;
  let testUser: { email: string; password: string };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);

    // Generate unique email for each test to avoid conflicts
    testUser = {
      email: `test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}@example.com`,
      password: 'TestPassword123!',
    };

    // Create test user via API
    await createTestUser(testUser.email, testUser.password);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.expectToBeOnLoginPage();

    await loginPage.login(testUser.email, testUser.password);

    // Should redirect to contacts page
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.navigate();

    await loginPage.login('wrong@example.com', 'WrongPassword123!');

    await loginPage.expectLoginError();
    await loginPage.expectToBeOnLoginPage();
  });

  test('should show error with incorrect password', async () => {
    await loginPage.navigate();

    await loginPage.login(testUser.email, 'WrongPassword123!');

    await loginPage.expectLoginError();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL('/forgot');
  });
});
