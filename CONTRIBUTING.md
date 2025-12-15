# Contributing to Birthday Project

Thank you for your interest in contributing to Birthday Project! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone, regardless of:
- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:
- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Docker version, browser)
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:
- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** or implementation ideas
- **Alternatives considered**
- **Additional context** or mockups

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - simple issues for beginners
- `help wanted` - issues where we need community help

## Development Setup

### Prerequisites

- Node.js 20+
- Docker Desktop
- Git
- Text editor (VS Code recommended)

### Local Development (Without Docker)

1. **Clone the repository**

```bash
git clone https://github.com/Va5s0/the-birthday-project.git
cd the-birthday-project
```

2. **Backend setup**

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your secrets
npm run dev
```

3. **Frontend setup** (in a new terminal)

```bash
yarn install
cp .env.example .env
yarn start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

### Docker Development

```bash
docker-compose up --build
```

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests (when added)
yarn test

# E2E tests (when added)
yarn test:e2e
```

## Pull Request Process

### Before Submitting

1. **Create a branch** from `master`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   - Run the application locally
   - Test in Docker
   - Check for console errors

4. **Commit your changes**
   - Follow commit message guidelines
   - Sign your commits (optional but appreciated)

### Submitting the PR

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Include screenshots for UI changes

3. **Code Review**
   - Address reviewer feedback
   - Keep the PR focused on one feature/fix
   - Be patient and respectful

### PR Requirements

- [ ] Code follows project coding standards
- [ ] Tests pass (when test suite exists)
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Descriptive commit messages

## Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Prefer **functional components** in React
- Use **hooks** over class components

### File Organization

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── services/        # API services
├── models/          # TypeScript types/interfaces
├── utils/           # Utility functions
└── styles/          # Global styles
```

### React Best Practices

- One component per file
- Use TypeScript interfaces for props
- Keep components small and focused
- Use TanStack Query for data fetching
- Avoid prop drilling - use Context when needed

### CSS/Styling

- Use **Emotion CSS** for styling
- Follow **mobile-first** approach
- Use CSS variables for theming
- Keep styles colocated with components

### Backend Best Practices

- Validate all inputs
- Use Prisma for database queries
- Handle errors gracefully
- Add logging for debugging
- Secure sensitive endpoints

## Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(contacts): add bulk import from CSV

- Add CSV parser for contact import
- Validate CSV format and data
- Show import progress indicator

Closes #123
```

```
fix(auth): prevent token expiration loop

Fixed an issue where expired tokens caused infinite refresh loops.

Fixes #456
```

## Questions?

- Open a [GitHub Discussion](https://github.com/Va5s0/the-birthday-project/discussions)
- Comment on related issues
- Reach out to maintainers

---

Thank you for contributing to Birthday Project! Your efforts help make this project better for everyone.
