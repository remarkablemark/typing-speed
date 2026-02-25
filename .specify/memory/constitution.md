<!--
Sync Impact Report:
- Version change: None (initial creation) → 1.0.0
- Modified principles: N/A (initial constitution)
- Added sections: Core Principles (5), Development Workflow, Governance
- Removed sections: N/A (initial constitution)
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (updated for React/TypeScript/Tailwind)
  ✅ .specify/templates/tasks-template.md (updated for React component patterns)
  ⚠ .specify/templates/spec-template.md (pending - may need testing requirements alignment)
  ⚠ .specify/templates/agent-file-template.md (pending - may need React-specific guidance)
- Follow-up TODOs: None (all placeholders filled)
-->

# Typing Speed Constitution

## Core Principles

### I. Test-First Development

Tests MUST be written before implementation. TDD is mandatory: write tests, validate they fail, then implement features. Red-Green-Refactor cycle strictly enforced. 100% test coverage required for all statements, branches, functions, and lines except barrel exports.

### II. React Component Standards

Functional components only with hooks at top level. Use semantic HTML and accessibility-first design. React Compiler handles optimization - avoid manual useMemo/useCallback. Destructure props in function signature for clarity.

### III. TypeScript Excellence

Strict mode enabled with explicit types for all variables. Prefer interfaces over types for object shapes. Use proper event types and component prop interfaces. No implicit any allowed.

### IV. Tailwind CSS Only

Use Tailwind utility classes exclusively - no custom CSS files. Implement responsive design with Tailwind prefixes. Support dark mode with dark: prefix when needed.

### V. Code Quality & Automation

No console.log statements or debugger code. Prettier formatting auto-applied on save. ESLint rules enforced with git hooks. Conventional commits required. All code must pass lint, type check, and tests before commits.

## Development Workflow

### Component Structure

Each component follows the standard pattern:

- ComponentName.tsx (main component)
- ComponentName.types.ts (TypeScript interfaces)
- ComponentName.test.tsx (unit tests)
- index.ts (barrel export)

### Import Order

1. External libraries (react, react-dom, etc.)
2. Internal modules (absolute imports starting with src/)
3. Relative imports (./, ../)

### Quality Gates

- ESLint must pass with no errors
- TypeScript type checking must pass
- All tests must pass with 100% coverage
- Prettier formatting applied
- Conventional commit message format

## Governance

This constitution supersedes all other development practices. Amendments require documentation, approval, and migration plan. All pull requests and reviews must verify compliance. Complexity must be justified with clear rationale. Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-02-24 | **Last Amended**: 2025-02-24
