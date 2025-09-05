# Testing Guide

This document provides comprehensive information about the testing setup for the Shalmal frontend application.

## Overview

The frontend uses Jest as the testing framework with React Testing Library for component testing. The testing setup includes:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Complete workflow testing
- **Service Tests**: API service testing with mocked responses
- **Coverage Reporting**: Comprehensive code coverage tracking

## Test Structure

```
src/
├── components/
│   ├── BillCard.test.tsx
│   ├── BillForm.test.tsx
│   ├── BillList.test.tsx
│   ├── PersonList.test.tsx
│   └── SearchBar.test.tsx
├── services/
│   └── billApi.test.ts
├── integration/
│   ├── bill-crud.test.tsx
│   └── payment-flow.test.tsx
├── test-utils/
│   ├── test-utils.tsx
│   ├── mock-data.ts
│   ├── mock-handlers.ts
│   └── index.ts
├── setupTests.ts
└── App.test.tsx
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode (default)
npm test

# Run tests in watch mode (interactive)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD pipeline
npm run test:ci

# Run tests in debug mode
npm run test:debug

# Update snapshots
npm run test:update

# Run linter
npm run test:lint

# Run type checking
npm run test:type-check
```

### Test Modes

1. **Watch Mode**: Continuously runs tests when files change
2. **Coverage Mode**: Generates coverage reports
3. **CI Mode**: Runs tests once with coverage for CI/CD
4. **Debug Mode**: Runs tests with debugging enabled
5. **Update Mode**: Updates Jest snapshots

## Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that includes necessary providers:

```typescript
import { render } from '../test-utils';

// Automatically includes Router and other providers
render(<MyComponent />);
```

### Mock Data

The `mock-data.ts` file contains factory functions and sample data:

```typescript
import { mockBill1, createMockBill } from '../test-utils/mock-data';

// Use predefined mock data
const bill = mockBill1;

// Create custom mock data
const customBill = createMockBill({ title: 'Custom Bill' });
```

### API Mocking

The `mock-handlers.ts` file provides MSW handlers for API mocking:

```typescript
import { handlers, errorHandlers } from '../test-utils/mock-handlers';

// Use in tests
server.use(...handlers);
server.use(...errorHandlers);
```

## Writing Tests

### Component Tests

```typescript
import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### Service Tests

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import MyService from './MyService';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MyService', () => {
  it('handles successful API calls', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.json({ data: 'test' }));
      })
    );

    const result = await MyService.getData();
    expect(result).toEqual({ data: 'test' });
  });
});
```

### Integration Tests

```typescript
import React from 'react';
import { render, screen, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Integration Tests', () => {
  it('completes full user workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate through the app
    await user.click(screen.getByText('Create Bill'));
    await user.type(screen.getByLabelText('Title'), 'Test Bill');
    await user.click(screen.getByText('Submit'));

    // Verify the result
    await waitFor(() => {
      expect(screen.getByText('Test Bill')).toBeInTheDocument();
    });
  });
});
```

## Coverage Requirements

The project enforces the following coverage thresholds:

- **Global**: 80% lines, 80% functions, 70% branches, 80% statements
- **Services**: 90% lines, 90% functions, 80% branches, 90% statements
- **Components**: 85% lines, 85% functions, 75% branches, 85% statements

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Text**: Console output
- **HTML**: Detailed HTML report in `coverage/` directory
- **LCOV**: For CI/CD integration
- **JSON**: Machine-readable format

## Best Practices

### 1. Test Structure

- Use `describe` blocks to group related tests
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Component Testing

- Test user interactions, not implementation details
- Use `screen` queries that reflect how users interact with the app
- Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`

### 3. Async Testing

- Use `waitFor` for async operations
- Use `userEvent` for realistic user interactions
- Handle loading states and error conditions

### 4. Mocking

- Mock external dependencies
- Use MSW for API mocking
- Keep mocks simple and focused

### 5. Coverage

- Aim for meaningful coverage, not just high numbers
- Test edge cases and error conditions
- Focus on critical business logic

## CI/CD Integration

The project includes GitHub Actions workflows that:

1. Run tests on multiple Node.js versions
2. Generate coverage reports
3. Upload coverage to Codecov
4. Comment coverage on pull requests
5. Enforce coverage thresholds

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout or check for infinite loops
2. **Mock not working**: Ensure MSW server is properly set up
3. **Coverage not updating**: Check file patterns in Jest config
4. **Type errors**: Ensure TypeScript types are properly imported

### Debug Mode

Use debug mode to troubleshoot failing tests:

```bash
npm run test:debug
```

This will run tests with debugging enabled and allow you to set breakpoints.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
