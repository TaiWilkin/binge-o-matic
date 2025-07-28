# Authentication Service Tests

This directory contains comprehensive automated tests for the authentication service (`auth.js`).

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

## Test Structure

### Auth Service Tests (`auth.test.js`)

The auth service tests cover:

#### Signup Function

- ✅ Input validation (email and password required)
- ✅ Error handling for login failures
- ✅ User creation validation
- ✅ Password hashing verification
- ✅ Duplicate email prevention

#### Login Function

- ✅ Successful login with valid credentials
- ✅ Error handling for invalid credentials
- ✅ Authentication context handling
- ✅ Login context error handling

#### Logout Function

- ✅ Successful logout
- ✅ Error handling for logout failures
- ✅ Handling logout without user

#### Integration Tests

- ✅ Full signup → logout flow
- ✅ Duplicate email registration prevention
- ✅ Password security and validation

## Test Coverage

The tests provide comprehensive coverage of:

- ✅ All public function exports
- ✅ Input validation and error cases
- ✅ Success scenarios
- ✅ Edge cases and error handling
- ✅ Security features (password hashing)
- ✅ Integration scenarios

## Mock Objects

The tests use mock objects to simulate:

- Request objects with `logIn` and `logout` methods
- Authentication context with `buildContext.authenticate` and `buildContext.login`
- Database operations for isolated unit testing

## Database Testing

For tests that require database operations, the setup includes:

- In-memory MongoDB instance
- Automatic cleanup between tests
- User model registration and schema validation

## Notes

The authentication service relies on:

- Mongoose for database operations
- bcryptjs for password hashing
- Passport.js for authentication strategies
- Express session management

All external dependencies are properly mocked or isolated in the test environment.
