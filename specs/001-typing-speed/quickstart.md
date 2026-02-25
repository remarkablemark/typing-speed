# Quickstart Guide: Typing Speed Test

**Date**: 2026-02-24 | **Feature**: Typing Speed Test

## Development Setup

### Prerequisites

- Node.js 24+
- npm or yarn package manager
- Git repository initialized

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:5173`

## Project Structure Overview

```
src/
├── components/           # React components
│   ├── TypingTest/      # Main typing interface
│   ├── ResultsDisplay/  # Results screen
│   ├── TestHistory/     # History view
│   ├── DifficultySelector/ # Difficulty selection
│   └── App/             # Main application
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
└── main.tsx             # Application entry point
```

## Development Workflow

### 1. Test-First Development (TDD)

```bash
# Write tests first (they should fail)
npm test -- TypingTest.test.tsx

# Implement component to make tests pass
# Tests will automatically re-run

# Refactor while maintaining green tests
```

### 2. Component Development Pattern

Each component follows this structure:

```
ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.types.ts # TypeScript interfaces
├── ComponentName.test.tsx # Unit tests
└── index.ts              # Barrel export
```

### 3. Quality Gates

Before committing, ensure all checks pass:

```bash
# Run linting
npm run lint

# Type checking
npm run lint:tsc

# Full test suite with coverage
npm run test:ci
```

## Key Implementation Details

### WPM Calculation

```typescript
// Standard: 5 characters = 1 word
const wpm = Math.round(charactersTyped / 5 / minutesElapsed);
```

### Accuracy Calculation

```typescript
const accuracy = Math.round((correctCharacters / totalCharacters) * 100);
```

### Real-time Updates

```typescript
// Use requestAnimationFrame for smooth 60fps updates
useEffect(() => {
  const updateMetrics = () => {
    // Update WPM and accuracy
    animationFrameId = requestAnimationFrame(updateMetrics);
  };

  if (testActive) {
    updateMetrics();
  }

  return () => cancelAnimationFrame(animationFrameId);
}, [testActive]);
```

### Session Storage

```typescript
// Store results for current session only
const saveResult = (result: TestResult) => {
  const sessionData = sessionStorage.getItem('typing-speed-test-data');
  const data = sessionData ? JSON.parse(sessionData) : { testHistory: [] };
  data.testHistory.push(result);
  sessionStorage.setItem('typing-speed-test-data', JSON.stringify(data));
};
```

## Styling Guidelines

### Tailwind CSS Only

- No custom CSS files
- Use utility classes for all styling
- Responsive design with `sm:`, `md:`, `lg:` prefixes

### Color Scheme

```typescript
// Use these Tailwind classes consistently
const colors = {
  correct: 'text-green-600 dark:text-green-400',
  incorrect: 'text-red-600 dark:text-red-400',
  untyped: 'text-gray-400 dark:text-gray-500',
  current: 'bg-blue-100 dark:bg-blue-900',
};
```

## Testing Strategy

### Component Testing

```typescript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { TypingTest } from './TypingTest';

test('starts timer on first keystroke', () => {
  const mockOnComplete = vi.fn();
  render(<TypingTest textSample={sample} onComplete={mockOnComplete} difficulty="easy" />);

  const textInput = screen.getByRole('textbox');
  fireEvent.keyDown(textInput, { key: 'a' });

  // Verify timer started and WPM calculation begins
  expect(screen.getByText(/WPM:/)).toBeInTheDocument();
});
```

### Utility Testing

```typescript
import { calculateWPM, calculateAccuracy } from '../utils';

test('calculates WPM correctly', () => {
  expect(calculateWPM(250, 1)).toBe(50); // 250 chars / 5 = 50 words / 1 minute
});
```

## Common Development Tasks

### Adding a New Difficulty Level

1. Update `DifficultyLevel` type in `types/typing.types.ts`
2. Add text samples in `utils/textSamples.ts`
3. Update `DifficultySelector` component
4. Add corresponding tests

### Modifying WPM Calculation

1. Update `utils/wpmCalculator.ts`
2. Update tests in `wpmCalculator.test.ts`
3. Verify impact on `TypingTest` component tests

### Adding New Text Samples

1. Update `utils/textSamples.ts` with public domain content
2. Ensure proper categorization by difficulty
3. Add tests for new samples

## Performance Considerations

### Real-time Updates

- Debounce input handling to prevent excessive re-renders
- Use `requestAnimationFrame` for smooth animations
- Memoize expensive calculations

### Memory Management

- Clean up timers and animation frames in useEffect cleanup
- Limit history storage to reasonable size
- Use session storage (not localStorage) for temporary data

## Deployment

### Build Process

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Static Hosting

The application builds to static files in `dist/` and can be deployed to:

- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Troubleshooting

### Common Issues

**Tests not finding components**:

- Ensure barrel exports (`index.ts`) are properly configured
- Check import paths match file structure

**Tailwind styles not applying**:

- Verify PostCSS configuration
- Ensure `@tailwind` directives are in `index.css`

**TypeScript errors**:

- Run `npm run lint:tsc` for detailed error information
- Check that all interfaces are properly exported

**Performance issues**:

- Use React DevTools Profiler to identify bottlenecks
- Check for unnecessary re-renders with console.log debugging
- Verify timer cleanup in useEffect hooks

## Getting Help

- Check the specification: `specs/001-typing-speed/spec.md`
- Review the data model: `specs/001-typing-speed/data-model.md`
- Consult UI contracts: `specs/001-typing-speed/contracts/ui-contracts.md`
- Reference project constitution: `.specify/memory/constitution.md`
