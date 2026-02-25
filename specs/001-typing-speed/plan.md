# Implementation Plan: Typing Speed Test

**Branch**: `001-typing-speed` | **Date**: 2026-02-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-typing-speed/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a single-page React typing speed test application that measures user WPM and accuracy using public domain text samples. The app will feature 3 difficulty levels, real-time feedback, test history tracking, and mobile-first responsive design. Implementation follows TDD with TypeScript strict mode and Tailwind CSS styling.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5 with React 19
**Primary Dependencies**: React 19, React DOM, Vite 7, Vitest 4, Tailwind CSS 4
**Storage**: Browser session storage for test results (current session only)
**Testing**: Vitest 4 with @testing-library/react, 100% coverage required
**Target Platform**: Web browser (static site)
**Project Type**: React web application
**Performance Goals**: 60fps UI, sub-100ms interactions, real-time WPM calculation
**Constraints**: Must follow TDD, TypeScript strict mode, Tailwind CSS only
**Scale/Scope**: Single-page typing speed test application
**Key Algorithms**: WPM calculation (5 chars = 1 word), accuracy percentage, real-time validation
**UI Framework**: React with semantic HTML, mobile-first responsive design
**State Management**: React hooks and component state
**Data Persistence**: Session storage for test history

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Required Compliance

- **Test-First Development**: Tests MUST be written before implementation (TDD mandatory)
- **React Component Standards**: Functional components only, semantic HTML, accessibility-first
- **TypeScript Excellence**: Strict mode, explicit types, no implicit any
- **Tailwind CSS Only**: No custom CSS files, use utility classes exclusively
- **Code Quality & Automation**: No console.log, ESLint + Prettier enforced, conventional commits

### Validation Checklist

- [ ] Run `npm run lint:tsc` to verify TypeScript strict mode compliance
- [ ] Run `npm run lint` to verify ESLint rules pass with no errors
- [ ] Run `npm test` after writing tests to confirm they FAIL (exit code 1)
- [ ] Run `npm run test:ci` after implementation to verify 100% coverage
- [ ] Verify component files follow pattern: Component.tsx, Component.types.ts, Component.test.tsx, index.ts
- [ ] Check styling uses only Tailwind utility classes (no custom CSS imports)
- [ ] Confirm git pre-commit hooks run successfully with `npm install`

## Project Structure

### Documentation (this feature)

```text
specs/001-typing-speed/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── TypingTest/
│   │   ├── TypingTest.tsx          # Main typing test component
│   │   ├── TypingTest.types.ts     # TypeScript interfaces
│   │   ├── TypingTest.test.tsx     # Unit tests
│   │   └── index.ts                   # Barrel export
│   ├── ResultsDisplay/
│   │   ├── ResultsDisplay.tsx      # Results component
│   │   ├── ResultsDisplay.types.ts # TypeScript interfaces
│   │   ├── ResultsDisplay.test.tsx # Unit tests
│   │   └── index.ts                 # Barrel export
│   ├── TestHistory/
│   │   ├── TestHistory.tsx          # History component
│   │   ├── TestHistory.types.ts     # TypeScript interfaces
│   │   ├── TestHistory.test.tsx     # Unit tests
│   │   └── index.ts                 # Barrel export
│   ├── DifficultySelector/
│   │   ├── DifficultySelector.tsx   # Difficulty selection component
│   │   ├── DifficultySelector.types.ts # TypeScript interfaces
│   │   ├── DifficultySelector.test.tsx # Unit tests
│   │   └── index.ts                 # Barrel export
│   └── App/
│       ├── App.tsx                  # Main application component
│       ├── App.types.ts             # TypeScript interfaces
│       ├── App.test.tsx             # Unit tests
│       └── index.ts                 # Barrel export
├── types/
│   ├── typing.types.ts             # Shared typing-related types
│   └── index.ts                     # Barrel export
├── utils/
│   ├── wpmCalculator.ts             # WPM calculation utilities
│   ├── accuracyCalculator.ts        # Accuracy calculation utilities
│   ├── textSamples.ts               # Public domain text samples
│   └── index.ts                     # Barrel export
├── hooks/
│   ├── useTypingTest.ts             # Custom hook for typing test logic
│   ├── useTimer.ts                  # Custom hook for timer functionality
│   └── index.ts                     # Barrel export
├── setupTests.ts                    # Test setup configuration
├── index.css                        # Global styles
├── main.tsx                         # Application entry point
└── vite-env.d.ts                    # Vite type definitions

public/                               # Static assets (SVGs, images, etc.)

index.html                           # Main HTML entry point
```

**Structure Decision**: React single-page application with component-based architecture. Components organized in feature folders with co-located tests and types. All styling via Tailwind CSS utilities.

## Implementation Dependencies

### User Story Dependencies

- **User Story 1 (P1)**: Foundation - can be implemented independently
- **User Story 2 (P2)**: Depends on User Story 1 completion (uses App component integration)
- **User Story 3 (P3)**: Depends on User Story 1 completion (uses App component integration)

### Phase Execution Order

1. **Phase 1**: Foundational infrastructure (blocks all other work)
2. **Phase 2**: User Story 1 implementation (enables Stories 2 & 3)
3. **Phase 3**: User Story 2 implementation (parallel with Story 3 after Phase 2)
4. **Phase 4**: User Story 3 implementation (parallel with Story 2 after Phase 2)
5. **Phase 5**: Polish and cross-cutting concerns

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
