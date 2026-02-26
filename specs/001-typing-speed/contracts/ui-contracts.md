# UI Contracts: Typing Speed Test

**Date**: 2026-02-24 | **Feature**: Typing Speed Test

## Component Interface Contracts

### TypingTest Component

**Purpose**: Main typing interface with real-time feedback

**Props Interface**:

```typescript
interface TypingTestProps {
  textSample: TextSample;
  onComplete: (result: TestResult) => void;
  difficulty: DifficultyLevel;
}
```

**State Management**:

- Internal state for user input, timer, and test status
- Emits `onComplete` callback when test finishes

**UI Requirements**:

- Display text sample with character-by-character feedback
- Real-time WPM and accuracy display
- Visual error highlighting (incorrect characters)
- Timer display showing elapsed time
- Responsive design for mobile/desktop

**Accessibility**:

- Keyboard navigation support
- Screen reader announcements for errors
- Focus management during active test

### ResultsDisplay Component

**Purpose**: Show completed test results

**Props Interface**:

```typescript
interface ResultsDisplayProps {
  result: TestResult;
  onRestart: () => void;
  onViewHistory: () => void;
}
```

**UI Requirements**:

- Large, clear WPM display
- Accuracy percentage with visual indicator
- Time elapsed display
- Difficulty level indicator
- Action buttons for restart/history

### TestHistory Component

**Purpose**: Display list of past test results

**Props Interface**:

```typescript
interface TestHistoryProps {
  results: TestResult[];
  onSelectResult: (result: TestResult) => void;
  onClearHistory: () => void;
}
```

**UI Requirements**:

- Chronological list of test results
- Summary statistics (average WPM, best score)
- Expandable details for each result
- Clear history functionality

### DifficultySelector Component

**Purpose**: Allow users to select test difficulty

**Props Interface**:

```typescript
interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}
```

**UI Requirements**:

- Three difficulty options (easy, medium, hard)
- Visual indication of selected difficulty
- Brief description of each difficulty level
- Responsive button layout

## Visual Design Contracts

### Color Scheme (Tailwind CSS)

**Primary Colors**:

- Text display: `text-gray-800` (dark mode: `text-gray-200`)
- Correct characters: `text-green-600` (dark mode: `text-green-400`)
- Incorrect characters: `text-red-600` (dark mode: `text-red-400`)
- Untyped characters: `text-gray-400` (dark mode: `text-gray-500`)
- Current position: `bg-blue-100` (dark mode: `bg-blue-900`)

**Background Colors**:

- Main background: `bg-gray-50` (dark mode: `bg-gray-900`)
- Card backgrounds: `bg-white` (dark mode: `bg-gray-800`)

**Interactive Elements**:

- Primary buttons: `bg-blue-600 hover:bg-blue-700`
- Secondary buttons: `bg-gray-200 hover:bg-gray-300`
- Disabled buttons: `bg-gray-300 cursor-not-allowed`

### Typography

**Font Families**: System fonts (`font-sans`)
**Text Sizes**:

- Display text (sample): `text-lg md:text-xl`
- WPM display: `text-4xl md:text-6xl font-bold`
- Labels: `text-sm font-medium`
- Body text: `text-base`

### Spacing & Layout

**Container**: `max-w-4xl mx-auto p-4 md:p-6`
**Card spacing**: `space-y-6`
**Button spacing**: `space-x-4`
**Responsive breakpoints**: `sm:`, `md:`, `lg:`, `xl:`

## Interaction Contracts

### Typing Behavior

**Input Handling**:

- Accept only keyboard input (no paste events)
- Track each keystroke for accuracy calculation
- Provide immediate visual feedback for errors
- Prevent backspace beyond current position

**Timer Logic**:

- Start on first valid keystroke
- Update WPM calculation every 100ms
- Stop when last character is typed correctly

**Error Handling**:

- Highlight incorrect characters in red
- Allow correction of mistakes
- Maintain accuracy calculation throughout test

### Navigation Flow

1. **Initial State**: Difficulty selector + start button
2. **Active Test**: Text display + real-time metrics
3. **Results Screen**: Final metrics + action buttons
4. **History View**: List of past results + statistics

### Responsive Behavior

**Mobile (< 768px)**:

- Single column layout
- Larger touch targets
- Simplified metric display
- Stack-based navigation

**Desktop (≥ 768px)**:

- Multi-column layout for results
- Hover states for interactive elements
- More detailed statistics
- Side-by-side components where appropriate

## Performance Contracts

### Rendering Requirements

- **Frame Rate**: Maintain 60fps during active typing
- **Input Latency**: < 16ms response to keystrokes
- **Metric Updates**: WPM updates every 100ms
- **Animation Duration**: < 200ms for state transitions

### Memory Constraints

- **Text Sample Size**: < 1KB per sample
- **History Storage**: < 50KB total (session storage limit)
- **Component State**: < 1KB per component
- **Bundle Size**: < 100KB total application size

## Accessibility Contracts

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via Tab
- **Screen Reader Support**: Semantic HTML + ARIA labels
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Focus Indicators**: Visible focus states for all interactive elements
- **Error Announcements**: Live regions for dynamic content changes

### Keyboard Shortcuts

- `Tab`: Navigate between interactive elements
- `Enter/Space`: Activate buttons and controls
- `Escape`: Cancel current action or return to previous state
- No custom keyboard shortcuts that conflict with browser defaults
