# Data Model: Typing Speed Test

**Date**: 2026-02-24 | **Feature**: Typing Speed Test

## Core Entities

### TypingTest

Represents an active typing test session.

**Properties**:

- `id`: string - Unique identifier for the test session
- `textSample`: TextSample - The text being typed
- `userInput`: string - Current user input
- `startTime`: Date | null - When test started (first keystroke)
- `endTime`: Date | null - When test ended (last character)
- `isActive`: boolean - Whether test is currently active
- `difficulty`: DifficultyLevel - Selected difficulty level

**State Transitions**:

- `Created` → `Active` (first keystroke)
- `Active` → `Completed` (last character typed)
- `Active` → `Abandoned` (user navigates away)

### TestResult

Represents a completed typing test with metrics.

**Properties**:

- `id`: string - Unique identifier
- `wpm`: number - Words per minute (5 chars = 1 word)
- `accuracy`: number - Percentage accuracy (0-100)
- `timeElapsed`: number - Time in seconds
- `timestamp`: Date - When test was completed
- `difficulty`: DifficultyLevel - Test difficulty
- `textSampleId`: string - Reference to text sample used

**Validation Rules**:

- `wpm` must be >= 0
- `accuracy` must be between 0-100
- `timeElapsed` must be > 0

### TextSample

Represents a text sample for typing practice.

**Properties**:

- `id`: string - Unique identifier
- `content`: string - The actual text content
- `difficulty`: DifficultyLevel - Assigned difficulty
- `wordCount`: number - Total words in sample
- `characterCount`: number - Total characters including spaces

**Validation Rules**:

- `content` must not be empty
- `wordCount` must match actual word count in content
- `characterCount` must match actual character count

## Enums

### DifficultyLevel

```typescript
enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
```

## Type Definitions

```typescript
interface TypingTest {
  id: string;
  textSample: TextSample;
  userInput: string;
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  difficulty: DifficultyLevel;
}

interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  timestamp: Date;
  difficulty: DifficultyLevel;
  textSampleId: string;
}

interface TextSample {
  id: string;
  content: string;
  difficulty: DifficultyLevel;
  wordCount: number;
  characterCount: number;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard';
```

## Data Relationships

- `TypingTest` contains one `TextSample`
- `TestResult` references one `TextSample` by ID
- `TestResult` has one `DifficultyLevel`
- `TextSample` has one `DifficultyLevel`

## Storage Schema

### Session Storage Structure

```typescript
interface SessionData {
  testHistory: TestResult[];
  currentTest?: TypingTest;
}
```

**Storage Key**: `typing-speed.data`

**Persistence**: Current browser session only (sessionStorage)

## Data Flow

1. **Test Initialization**: Create `TypingTest` with selected `TextSample`
2. **Test Progress**: Update `userInput` and `startTime` on first keystroke
3. **Test Completion**: Calculate metrics, create `TestResult`, store in history
4. **History Retrieval**: Load `testHistory` array from session storage

## Validation Logic

### WPM Calculation

```typescript
const calculateWPM = (characters: number, minutes: number): number => {
  return Math.round(characters / 5 / minutes);
};
```

### Accuracy Calculation

```typescript
const calculateAccuracy = (correct: number, total: number): number => {
  return Math.round((correct / total) * 100);
};
```
