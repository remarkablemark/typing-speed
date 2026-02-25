---
description: 'Task list template for feature implementation'
---

# Tasks: Typing Speed Test

**Input**: Design documents from `/specs/001-typing-speed/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included - TDD approach required by project constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **React project**: `src/`, tests co-located with components
- **Component structure**: `src/components/ComponentName/ComponentName.tsx`
- **Test files**: `src/components/ComponentName/ComponentName.test.tsx`
- **Type definitions**: `src/components/ComponentName/ComponentName.types.ts`
- Paths shown below assume React component structure

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Create component directory structure per implementation plan
- [x] T002 [P] Create shared TypeScript interfaces in src/types/typing.types.ts
- [x] T003 [P] Implement WPM calculation utility in src/utils/wpmCalculator.ts
- [x] T004 [P] Implement accuracy calculation utility in src/utils/accuracyCalculator.ts
- [x] T005 [P] Create text samples data in src/utils/textSamples.ts
- [x] T006 [P] Create barrel exports for utils in src/utils/index.ts
- [x] T007 [P] Create barrel exports for types in src/types/index.ts
- [x] T008 [P] Configure input validation utilities in src/utils/inputValidator.ts
- [x] T009 [P] Implement comprehensive cheating prevention in src/utils/antiCheat.ts (covers FR-010)
  - Prevent copy-paste operations during test
  - Detect unrealistic typing speeds (>200 WPM)
  - Prevent tab switching during active test
  - Handle browser refresh detection
  - Validate input characters and sequences
- [x] T010 Configure error boundary setup in src/components/App/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 2: User Story 1 - Basic Typing Test (Priority: P1) 🎯 MVP

**Goal**: User can measure typing speed with real-time WPM and accuracy feedback

**Independent Test**: Load page, type provided text, verify WPM and accuracy calculated and displayed correctly

### Tests for User Story 1 (TDD - Write FIRST, ensure they FAIL) ⚠️

- [ ] T011 [P] [US1] Component test for TypingTest in src/components/TypingTest/TypingTest.test.tsx
- [ ] T012 [P] [US1] Component test for App in src/components/App/App.test.tsx
- [ ] T013 [P] [US1] Utility test for wpmCalculator in src/utils/wpmCalculator.test.ts
- [ ] T014 [P] [US1] Utility test for accuracyCalculator in src/utils/accuracyCalculator.test.ts
- [ ] T015 [P] [US1] Utility test for antiCheat in src/utils/antiCheat.test.ts
- [ ] T016 [P] [US1] Hook test for useTypingTest in src/hooks/useTypingTest.test.ts
- [ ] T017 [P] [US1] Hook test for useTimer in src/hooks/useTimer.test.ts
- [ ] T018 [P] [US1] Utility test for inputValidator in src/utils/inputValidator.test.ts

**VALIDATION STEP**: Run `npm test -- src/components/TypingTest/TypingTest.test.tsx src/components/App/App.test.tsx src/utils/wpmCalculator.test.ts src/utils/accuracyCalculator.test.ts src/utils/antiCheat.test.ts src/hooks/useTypingTest.test.ts src/hooks/useTimer.test.ts src/utils/inputValidator.test.ts` and confirm exit code 1 (tests FAIL) before proceeding to implementation tasks (TDD required by constitution - Test-First Development principle)

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create TypingTest types in src/components/TypingTest/TypingTest.types.ts
- [ ] T020 [P] [US1] Create comprehensive input validation in src/utils/inputValidator.ts
- [ ] T021 [US1] Integrate input validation with TypingTest component
- [ ] T022 [P] [US1] Create App types in src/components/App/App.types.ts
- [ ] T023 [P] [US1] Create useTypingTest hook in src/hooks/useTypingTest.ts
- [ ] T024 [P] [US1] Create useTimer hook in src/hooks/useTimer.ts
- [ ] T025 [P] [US1] Create barrel exports for hooks in src/hooks/index.ts
- [ ] T026 [US1] Implement TypingTest component in src/components/TypingTest/TypingTest.tsx (depends on T019, T021, T024)
- [ ] T027 [US1] Implement App component in src/components/App/App.tsx (depends on T022, T026)
- [ ] T028 [P] [US1] Create barrel export for TypingTest in src/components/TypingTest/index.ts
- [ ] T029 [P] [US1] Create barrel export for App in src/components/App/index.ts
- [ ] T030 [US1] Add accessibility attributes and ARIA labels to TypingTest
- [ ] T031 [US1] Add error handling and loading states to TypingTest
- [ ] T032 [US1] Add responsive design with Tailwind classes to TypingTest

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 3: User Story 2 - Test Results and History (Priority: P2)

**Goal**: User can view test results and track improvement over multiple sessions

**Independent Test**: Complete multiple tests, verify results stored and displayed in history view

### Tests for User Story 2 (TDD - Write FIRST, ensure they FAIL) ⚠️

- [ ] T033 [P] [US2] Component test for ResultsDisplay in src/components/ResultsDisplay/ResultsDisplay.test.tsx
- [ ] T034 [P] [US2] Component test for TestHistory in src/components/TestHistory/TestHistory.test.tsx
- [ ] T035 [P] [US2] Integration test for session storage in src/utils/sessionStorage.test.ts

**VALIDATION STEP**: Run `npm test -- src/components/ResultsDisplay/ResultsDisplay.test.tsx src/components/TestHistory/TestHistory.test.tsx src/utils/sessionStorage.test.ts` and confirm exit code 1 (tests FAIL) before proceeding to implementation tasks (TDD required by constitution - Test-First Development principle)

### Implementation for User Story 2

- [ ] T036 [P] [US2] Create ResultsDisplay types in src/components/ResultsDisplay/ResultsDisplay.types.ts
- [ ] T037 [P] [US2] Create TestHistory types in src/components/TestHistory/TestHistory.types.ts
- [ ] T038 [P] [US2] Implement session storage utility in src/utils/sessionStorage.ts
- [ ] T039 [P] [US2] Implement ResultsDisplay component in src/components/ResultsDisplay/ResultsDisplay.tsx (depends on T036)
- [ ] T040 [P] [US2] Implement TestHistory component in src/components/TestHistory/TestHistory.tsx (depends on T037, T038)
- [ ] T041 [P] [US2] Create barrel export for ResultsDisplay in src/components/ResultsDisplay/index.ts
- [ ] T042 [P] [US2] Create barrel export for TestHistory in src/components/TestHistory/index.ts
- [ ] T043 [P] [US2] Update barrel export for utils in src/utils/index.ts (include sessionStorage)
- [ ] T044 [US2] Integrate ResultsDisplay with App component
- [ ] T045 [US2] Integrate TestHistory with App component
- [ ] T046 [US2] Add accessibility attributes to ResultsDisplay and TestHistory
- [ ] T047 [US2] Add responsive design to ResultsDisplay and TestHistory

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 4: User Story 3 - Difficulty Levels (Priority: P3)

**Goal**: User can choose from 3 difficulty levels with appropriate text complexity

**Independent Test**: Select different difficulty levels, verify appropriate text samples provided

### Tests for User Story 3 (TDD - Write FIRST, ensure they FAIL) ⚠️

- [ ] T048 [P] [US3] Component test for DifficultySelector in src/components/DifficultySelector/DifficultySelector.test.tsx
- [ ] T049 [P] [US3] Utility test for text samples difficulty categorization in src/utils/textSamples.test.ts

**VALIDATION STEP**: Run `npm test -- src/components/DifficultySelector/DifficultySelector.test.tsx src/utils/textSamples.test.ts` and confirm exit code 1 (tests FAIL) before proceeding to implementation tasks (TDD required by constitution - Test-First Development principle)

### Implementation for User Story 3

- [ ] T050 [P] [US3] Create DifficultySelector types in src/components/DifficultySelector/DifficultySelector.types.ts
- [ ] T051 [P] [US3] Implement DifficultySelector component in src/components/DifficultySelector/DifficultySelector.tsx (depends on T050)
- [ ] T052 [P] [US3] Create barrel export for DifficultySelector in src/components/DifficultySelector/index.ts
- [ ] T053 [US3] Integrate DifficultySelector with App component
- [ ] T054 [US3] Update TypingTest to handle difficulty-based text samples
- [ ] T055 [US3] Add accessibility attributes to DifficultySelector
- [ ] T056 [US3] Add responsive design to DifficultySelector

**Checkpoint**: All user stories should now be independently functional

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T057 [P] Update main.tsx entry point with App component
- [ ] T058 [P] Update index.html with proper meta tags and accessibility
- [ ] T059 [P] Documentation updates in README.md
- [ ] T060 Code cleanup and refactoring across all components
- [ ] T061 Performance optimization for real-time WPM updates
- [ ] T062 [P] Additional unit tests for edge cases in all utilities
- [ ] T063 Accessibility audit and improvements across all components
- [ ] T064 Run full test suite and ensure 100% coverage
- [ ] T065 Final responsive design testing across all breakpoints
- [ ] T066 Error boundary testing and validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Foundational completion - BLOCKS all other stories
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion
- **User Story 3 (Phase 4)**: Depends on User Story 1 completion
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (uses App component integration)
- **User Story 3 (P3)**: Depends on User Story 1 (uses App component integration)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD required)
- Types before components
- Utilities before components
- Components before integration
- Core implementation before cross-component integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Foundational tasks marked [P] can run in parallel
- All tests for a user story marked [P] can run in parallel
- Types within a story marked [P] can run in parallel
- Utilities within a story marked [P] can run in parallel
- Different components within same phase can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Component test for TypingTest in src/components/TypingTest/TypingTest.test.tsx"
Task: "Component test for App in src/components/App/App.test.tsx"
Task: "Utility test for wpmCalculator in src/utils/wpmCalculator.test.ts"
Task: "Utility test for accuracyCalculator in src/utils/accuracyCalculator.test.ts"

# Launch all types for User Story 1 together:
Task: "Create TypingTest types in src/components/TypingTest/TypingTest.types.ts"
Task: "Create App types in src/components/App/App.types.ts"

# Launch all utilities for User Story 1 together:
Task: "Create useTypingTest hook in src/hooks/useTypingTest.ts"
Task: "Create useTimer hook in src/hooks/useTimer.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational (CRITICAL - blocks all stories)
2. Complete Phase 2: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1: Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Phase 2)
   - Developer B: User Story 2 (Phase 3) - waits for US1
   - Developer C: User Story 3 (Phase 4) - waits for US1
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD required by constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Follow React patterns: functional components, TypeScript interfaces, Tailwind styling
- Constitution compliance: TDD mandatory, 100% coverage required, no console.log statements
