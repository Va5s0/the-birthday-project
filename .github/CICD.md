# CI/CD Documentation

## E2E Test Automation

This project uses GitHub Actions to automatically run end-to-end tests on every push and pull request.

### Workflow Overview

The E2E test workflow (`.github/workflows/e2e-tests.yml`) performs the following steps:

1. **Environment Setup**
   - Checks out the code
   - Sets up Node.js 20
   - Installs dependencies for both root and server projects
   - Installs Playwright browsers (Chromium)

2. **Database Setup**
   - Generates Prisma client
   - Creates test database (SQLite)
   - Runs migrations

3. **Application Build**
   - Builds the frontend application
   - Creates necessary environment files

4. **Server Startup**
   - Starts backend server on port 5001
   - Starts frontend server on port 3002
   - Waits for both servers to be ready

5. **Test Execution**
   - Runs all E2E tests using Playwright
   - Retries failed tests up to 2 times (CI only)

6. **Artifact Upload**
   - Uploads test report (HTML)
   - Uploads screenshots and videos of failures
   - Uploads test results JSON
   - Retains artifacts for 30 days

### Trigger Events

The workflow runs on:
- **Push** to `master`, `main`, or `develop` branches
- **Pull requests** targeting `master`, `main`, or `develop` branches

### Test Statistics

Current test coverage:
- **41 total tests** (40 passing, 1 skipped)
- **Authentication**: 14 tests
- **Contact Management**: 8 tests
- **Calendar View**: 8 tests passing, 1 skipped
- **Connection Management**: 10 tests

### Viewing Test Results

#### In Pull Requests
Test results appear as a check in the PR. Click "Details" to see:
- Test execution logs
- Number of passed/failed tests
- Links to artifacts

#### Test Artifacts
After a workflow run:
1. Go to the Actions tab
2. Click on the workflow run
3. Scroll to "Artifacts" section
4. Download:
   - `playwright-report` - HTML report with screenshots/videos
   - `test-results` - JSON results file

### Local Testing vs CI

#### Local Testing
- Uses development database
- Frontend starts automatically via `webServer` config
- No retries on failure
- Runs in headed mode with `--headed` flag

#### CI Testing
- Uses dedicated test database
- Frontend and backend started manually
- Retries failed tests up to 2 times
- Runs in headless mode
- `.only` calls are forbidden

### Environment Variables

The workflow creates the following environment files:

**`.env.test`** (Root):
```
TEST_BASE_URL=http://localhost:3002
TEST_API_URL=http://localhost:5001/api
TEST_DATABASE_URL="file:./server/prisma/test.db"
TEST_USER_EMAIL=testuser@example.com
TEST_USER_PASSWORD=TestPassword123!
TEST_USER2_EMAIL=testuser2@example.com
TEST_USER2_PASSWORD=TestPassword456!
```

**`server/.env`** (Backend):
```
PORT=5001
DATABASE_URL="file:./prisma/test.db"
JWT_SECRET=test-jwt-secret-for-ci-only-not-production
JWT_REFRESH_SECRET=test-refresh-secret-for-ci-only-not-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=test
```

### Troubleshooting

#### Tests Failing in CI but Passing Locally
1. Check if `.only` is used in any test (forbidden in CI)
2. Verify environment variables are correct
3. Check server startup logs for errors
4. Download artifacts to see screenshots/videos

#### Timeout Issues
- Default timeout is 15 minutes for entire workflow
- Individual test timeout is 60 seconds
- Server startup timeout is 60 seconds
- Increase timeouts if needed in `playwright.config.ts`

#### Database Migration Failures
- Ensure all migrations are committed
- Check `server/prisma/migrations` directory
- Verify `schema.prisma` is up to date

### Adding New Tests

When adding new tests:
1. Follow existing patterns in `e2e/tests/`
2. Use page objects from `e2e/page-objects/`
3. Use API helpers for test data setup
4. Run tests locally first
5. Ensure no `.only` calls before committing

### Performance Optimization

Current optimizations:
- **Sequential execution** (workers: 1) - Prevents database conflicts
- **Cache npm modules** - Speeds up dependency installation
- **Install only Chromium** - Faster than installing all browsers
- **Reuse existing servers** locally - Skip startup time

### Future Improvements

Potential enhancements:
- [ ] Add test result badges to README
- [ ] Set up Slack/Discord notifications for failures
- [ ] Run tests on multiple browsers (Firefox, Safari)
- [ ] Add performance testing metrics
- [ ] Implement visual regression testing
- [ ] Add code coverage reporting
