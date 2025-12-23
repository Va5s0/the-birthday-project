import { test as base } from '@playwright/test';
import { resetDatabase, seedDatabase, SeedData } from '../helpers/database-helpers';

type DatabaseFixtures = {
  cleanDatabase: void;
  seededDatabase: (data: SeedData) => Promise<void>;
};

export const test = base.extend<DatabaseFixtures>({
  // Fixture that resets database before each test
  cleanDatabase: [
    async ({}, use) => {
      await resetDatabase();
      await use();
      // Optionally cleanup after test
    },
    { auto: true },
  ],

  // Fixture that allows seeding database with custom data
  seededDatabase: async ({}, use) => {
    await use(async (data: SeedData) => {
      await resetDatabase();
      await seedDatabase(data);
    });
  },
});

export { expect } from '@playwright/test';
