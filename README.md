## 🧪 Testing

This project includes comprehensive unit tests with excellent coverage.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:

- ✅ Weather service API calls and error handling
- ✅ Component rendering and user interactions
- ✅ Loading and error states
- ✅ Weather icon rendering for all conditions
- ✅ Data transformation and display
- ✅ Input validation and edge cases

### Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test configuration
│   ├── utils.tsx             # Test utilities
│   └── mocks/
│       └── weatherData.ts    # Mock data
├── components/__tests__/
│   ├── WeatherCard.test.tsx
│   └── WeatherIcon.test.tsx
├── services/__tests__/
│   └── weatherService.test.ts
├── types/__tests__/
│   └── weather.test.ts
└── __tests__/
    └── App.test.tsx
```

### Testing Tools

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers
