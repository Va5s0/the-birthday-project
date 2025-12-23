import { test as base, Page } from '@playwright/test';
import { resetDatabase } from '../helpers/database-helpers';
import { createTestUser, getAuthTokens } from '../helpers/api-helpers';

type AuthFixtures = {
  authenticatedPage: Page;
  testUser: { email: string; password: string; id: string };
  accessToken: string;
};

export const test = base.extend<AuthFixtures>({
  // Fixture that provides an authenticated page
  authenticatedPage: async ({ page }, use) => {
    // Reset database before each test
    await resetDatabase();

    // Create test user with unique email
    const testUser = {
      email: `test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}@example.com`,
      password: process.env.TEST_USER_PASSWORD || 'TestPass123!',
    };

    // Register user via API
    const user = await createTestUser(testUser.email, testUser.password);

    // Get auth tokens
    const { accessToken, refreshToken } = await getAuthTokens(testUser.email, testUser.password);

    // Set authentication state in browser
    await page.goto('/');
    await page.evaluate((token) => {
      localStorage.setItem('accessToken', token);
    }, accessToken);

    // Set refresh token cookie
    await page.context().addCookies([
      {
        name: 'refreshToken',
        value: refreshToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);

    // Reload to apply auth state
    await page.reload();

    // Wait for navigation to complete and ensure we're on the home page
    await page.waitForURL('/', { timeout: 10000 }).catch(async () => {
      // If not automatically redirected, navigate to home
      await page.goto('/');
    });

    await use(page);
  },

  // Fixture that provides test user data
  testUser: async ({}, use) => {
    // Reset database
    await resetDatabase();

    const testUser = {
      email: `test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}@example.com`,
      password: process.env.TEST_USER_PASSWORD || 'TestPass123!',
      id: '',
    };

    const user = await createTestUser(testUser.email, testUser.password);
    testUser.id = user.id;

    await use(testUser);
  },

  // Fixture that provides access token
  accessToken: async ({ authenticatedPage }, use) => {
    // Get the access token from localStorage
    const token = await authenticatedPage.evaluate(() => {
      return localStorage.getItem('accessToken') || '';
    });

    await use(token);
  },
});

export { expect } from '@playwright/test';
