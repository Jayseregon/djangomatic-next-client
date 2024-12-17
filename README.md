# Next.js & NextUI Application for Djangomatic

[![Version](https://img.shields.io/badge/version-1.7.24-blue)](https://github.com/teleconapplications/djangomatic_prototype)
[![Last Updated](https://img.shields.io/badge/last%20updated-2024.12.17-brightgreen)](https://github.com/teleconapplications/djangomatic_prototype)

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [How to Use](#how-to-use)
    - [Prerequisites](#prerequisites)
    - [Local Development](#local-development)
    - [Database Management](#database-management)
3. [CI/CD and Branching Strategy](#cicd-and-branching-strategy)
4. [Developer Best Practices](#developer-best-practices)
5. [License](#license)
6. [Contact](#contact)

## Technologies Used

- [Next.js 15](https://nextjs.org/docs/getting-started) - for web framework
- [NextUI](https://nextui.org/) - for UI components
- [Tailwind CSS](https://tailwindcss.com/) - for styling
- [Tailwind Variants](https://tailwind-variants.org) - for dynamic styling
- [TypeScript](https://www.typescriptlang.org/) - for type safety
- [Motion](https://motion.dev/) - for animations
- [next-themes](https://github.com/pacocoursey/next-themes) - for theme management
- [Prisma](https://www.prisma.io/) - for db management 
- [Jest](https://jestjs.io/) - for testing
- [ESLint](https://eslint.org/) - for code linting
- [Prettier](https://prettier.io/) - for code formatting

## How to Use

### Prerequisites

- Docker (for local PostgreSQL database)
- Node.js (v20 or higher)
- npm (v9 or higher)

### Local Development

1. Start PostgreSQL database:
```bash
docker compose up -d --build
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm run dev
```

4. Run linting:
```bash
npm run lint
```

5. Run tests:
```bash
npm test
```


### Database Management

New migrations (dev):
```bash
npx prisma migrate dev --name <migration_name>
```

Apply existing migrations (dev):
```bash
npx prisma migrate dev
```

Access to Prisma Studio (local)
```bash
npx prisma studio
```

Apply migrations (prod):
```bash
npx prisma migrate deploy
```

## CI/CD and Branching Strategy

### Branches

- `main`: Default branch from which new branches are created. PRs must be submitted to `main`.
- `staging`: Deploys to staging/pre-production environment for testing.
- `production`: Live production branch, updated once all checks, tests, and staging are cleared.

*All branches are protected, read-only, and require PRs for any updates.*

### Deployment Flow

1. **PR updates to `main`**
    - Multiple updates can be merged into `main` before a global test.
2. **PR to `staging` for testing**
    - Perform a comprehensive test of all updates in `staging`.
3. **Issue Handling in `staging`**
    - If issues are identified, create issues and PR fixes directly to `staging`.
4. **PR `staging` to `main`**
    - Once all checks pass, merge `staging` back into `main`.
5. **PR `main` to `production`**
    - Deploy to live production environment after final approval.

6. GitHub Actions automatically:
    - Builds Docker images
    - Pushes to Azure Container Registry
    - Deploys to respective environments

## Developer Best Practices

### Workflow

1. Create GitHub issues
    - Title format: `[Type] Brief Description`
    - Types: `Feature`, `Bug`, `Enhancement`, `Tech Debt`
    - Examples:
      - `[Feature] Add user authentication flow`
      - `[Bug] Fix database connection timeout`
    - Include:
      - Clear objective
      - Acceptance criteria
      - Technical requirements

2. Create feature branches
    - Manually:
      - Branch naming: `type/issue-number/brief-description`
      - Examples:
        - `feature/123/add-auth-flow`
        - `bugfix/456/fix-db-timeout`
    - From GitHub Issues (recommended):
      - Use GitHub's "Create a branch" feature
      - Branch will be automatically named based on issue number and title
      - Example: `123-add-user-authentication-flow`

3. Commit best practices
    - Format: `type(scope): description`
    - Examples:
      - `feat(auth): implement login form`
      - `fix(db): resolve connection timeout`
      - `chore(deps): update dependencies`
    - Keep commits atomic and focused
    - Use present tense
4. Run linting after each commit:
```bash
npm run lint
```
5. Ensure all tests pass:
```bash
npm test
```
6. Submit PR for code review
7. Address review comments

### Code Quality

- Write comprehensive tests
- Follow TypeScript best practices
- Document code changes
- Participate in code reviews
- Keep dependencies updated

## License

This project is licensed under the GNU Affero General Public License. See the `LICENSE` file for details.

Please note that while this project uses an open-source license, it is not open to public contributions.

## Contact

If you have any questions or need further clarification, feel free to reach out to the head developer of this project:

> `Jeremie Bitsch`

Contact can be done via Teams or email. Please use the appropriate channel based on the nature of your query.
