# Tests

This directory contains automated tests.

## Test Setup

The tests use:

- **Jest** as the testing framework
- **MongoDB Memory Server** for in-memory database testing
- **Supertest** for HTTP testing (if needed for integration tests)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only auth tests
npm test -- --testPathPattern="auth"
```
