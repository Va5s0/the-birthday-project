// Import PrismaClient from server's generated client
import { PrismaClient } from '../../server/node_modules/.prisma/client/index.js';
import path from 'path';

// Use development database for E2E tests
const TEST_DB_PATH = path.resolve(__dirname, '../../server/data/database.db');

// Create Prisma client for test database
export function getTestPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: `file:${TEST_DB_PATH}`,
      },
    },
  });
}

// Reset database to clean state
export async function resetDatabase() {
  const prisma = getTestPrismaClient();

  try {
    // Delete all records in reverse order of dependencies
    await prisma.refreshToken.deleteMany();
    await prisma.passwordReset.deleteMany();
    await prisma.connection.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.user.deleteMany();

    // Force a small delay to ensure writes are flushed
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('✓ Test database reset complete');
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Seed database with test data
export async function seedDatabase(data: SeedData) {
  const prisma = getTestPrismaClient();

  try {
    // Create users
    if (data.users) {
      for (const user of data.users) {
        await prisma.user.create({ data: user });
      }
    }

    // Create contacts
    if (data.contacts) {
      for (const contact of data.contacts) {
        await prisma.contact.create({ data: contact });
      }
    }

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export interface SeedData {
  users?: any[];
  contacts?: any[];
}
