async function globalSetup() {
  console.log('\n🔧 Running global test setup...\n');

  // For E2E tests, we use the development database and clean it before tests
  // The development database should already exist and have migrations applied

  console.log('✓ Using development database for E2E tests');
  console.log('✅ Global setup complete\n');
}

export default globalSetup;
