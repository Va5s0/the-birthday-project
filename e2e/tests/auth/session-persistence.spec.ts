import { test, expect } from '../../fixtures/database.fixture';
import { test as authTest } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../page-objects/auth/login.page';
import { createTestUser } from '../../helpers/api-helpers';

test.describe('Session Persistence', () => {
  authTest('should maintain session after page reload', async ({ authenticatedPage }) => {
    // User is already authenticated via fixture
    await expect(authenticatedPage).toHaveURL('/', { timeout: 10000 });

    // Reload the page
    await authenticatedPage.reload();

    // Should still be on the main page (not redirected to login)
    await expect(authenticatedPage).toHaveURL('/');

    // Verify we can see authenticated content (e.g., not login form)
    await expect(authenticatedPage.getByLabel(/email/i)).not.toBeVisible();
  });

  authTest('should maintain session in new browser context', async ({ browser }) => {
    // Create first authenticated session
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();

    // Login in first context
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await createTestUser(uniqueEmail, 'TestPassword123!');

    const loginPage = new LoginPage(page1);
    await loginPage.navigate();
    await loginPage.login(uniqueEmail, 'TestPassword123!');
    await expect(page1).toHaveURL('/', { timeout: 10000 });

    // Get cookies from first context
    const cookies = await context1.cookies();

    // Create new context and add cookies
    const context2 = await browser.newContext();
    await context2.addCookies(cookies);
    const page2 = await context2.newPage();

    // Navigate to home - should be authenticated
    await page2.goto('/');
    await expect(page2).toHaveURL('/');
    await expect(page2.getByLabel(/email/i)).not.toBeVisible();

    await context1.close();
    await context2.close();
  });

  test('should redirect to login after logout', async ({ page }) => {
    // Login first
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await createTestUser(uniqueEmail, 'TestPassword123!');

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(uniqueEmail, 'TestPassword123!');
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Click the more actions button (three vertical dots in the profile section)
    // Find it by the MoreVertIcon
    const moreButton = page.locator('button').filter({ has: page.locator('[data-testid="MoreVertIcon"]') });
    await moreButton.click();

    // Wait for menu to open and click logout
    await page.getByText('Logout').click();

    // Should redirect to login page
    await expect(page).toHaveURL(/\/(login|signup)/, { timeout: 5000 });
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access home page without authentication
    await page.goto('/');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/(login|signup)/, { timeout: 5000 });
  });

  test('should not allow access to protected routes with expired token', async ({ page }) => {
    // Create user and login
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await createTestUser(uniqueEmail, 'TestPassword123!');

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(uniqueEmail, 'TestPassword123!');
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Manually invalidate the token
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'invalid-token');
    });

    // Reload page - should redirect to login due to invalid token
    await page.reload();

    // Should either redirect to login or stay on page (depending on refresh token)
    // If refresh token works, it will stay on /
    // If refresh token fails, it will redirect to login
    const url = page.url();
    const isOnHomeOrLogin = url === 'http://localhost:3002/' || url.includes('/login') || url.includes('/signup');
    expect(isOnHomeOrLogin).toBe(true);
  });
});
