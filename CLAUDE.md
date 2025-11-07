# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wake up When is a Progressive Web App that calculates wake-up times based on train departure times and customizable morning routine stages. Built with **TypeScript**, React 19, Vite, Tailwind CSS, and PWA capabilities for offline use.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173

# Testing
npm test                 # Run tests in watch mode
npm test -- --run        # Run tests once (CI mode)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Linting
npm run lint             # Run ESLint (fails on warnings)
npm run lint:fix         # Auto-fix ESLint issues

# Building
npm run build           # Production build
npm run preview         # Preview production build locally
```

## Architecture

### TypeScript Configuration

The project uses **strict TypeScript** with comprehensive type checking:
- `strict: true` - All strict checks enabled
- `noUncheckedIndexedAccess: true` - Array access safety
- `noUnusedLocals/Parameters: true` - Catch unused code
- ESLint with `typescript-eslint` for additional linting

Type definitions are in:
- `src/utils/timeCalculations.ts` - `Stage` interface
- All component files use proper TypeScript types

### State Management

The app uses React's built-in hooks - no external state management library. All state lives in `src/App.tsx`:

- **trainTime**: String in HH:MM format, persisted to localStorage
- **stages**: Array of `Stage` objects with `{ id, name, duration, enabled }` structure, persisted to localStorage
- **draggedIndex/dragOverIndex**: State for drag-and-drop reordering

**Persistence**: Uses custom `useLocalStorage` hook in `src/hooks/useLocalStorage.ts` to automatically save/restore state.

Stage order matters: stages are displayed and calculated in array order, representing the chronological sequence of the morning routine.

### Time Calculation Logic

Time calculations are centralized in `src/utils/timeCalculations.ts`:
- Validates time format (HH:MM with bounds checking)
- Converts train time to total minutes from midnight
- Subtracts all enabled stage durations
- Handles wrap-around for previous day (negative minutes)
- Returns formatted HH:MM string or empty string for invalid input

**Important**: The calculation uses `useMemo` for derived state, not `useEffect`. This prevents unnecessary re-renders and follows React best practices.

### Drag-and-Drop Implementation

Stage reordering uses native HTML5 drag-and-drop API (not a library):
- `draggable` attribute on stage elements
- Event handlers: `onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`, `onDragEnd`
- Visual feedback via Tailwind classes during drag operations
- Reordering done via array splice operations

### PWA Configuration

PWA setup is in `vite.config.ts` using `vite-plugin-pwa`:
- Auto-updates via `registerType: 'autoUpdate'`
- Workbox caches all static assets (`**/*.{js,css,html,ico,png,svg}`)
- Service worker registration happens automatically

## Testing Strategy

Tests use Vitest + React Testing Library with TypeScript:
- Component tests in `src/App.test.tsx`
- Utility tests in `src/utils/timeCalculations.test.ts`
- Test setup in `src/test/setup.ts` (includes jsdom and jest-dom matchers)
- Run single test file: `npm test -- App.test.tsx`
- Globals enabled in Vitest config for describe/it/expect
- All tests are fully typed with TypeScript

## Styling Approach

Uses Tailwind CSS v4 (latest version) with PostCSS:
- All styles are inline utility classes
- No custom CSS beyond `@import "tailwindcss"` in `src/index.css`
- Responsive design: mobile-first with `sm:` breakpoints
- Design system: gray scale, rounded corners, minimal shadows

## Key Component Patterns

**Stage rendering**: Map over `stages` array with drag-and-drop handlers, conditional styling for enabled/disabled states, and inline editing for names and durations.

**Preset time buttons**: Quick-select buttons [20, 40, 60] for common duration values, only visible when stage is enabled.

**Toggle behavior**: Stages can be disabled without deletion, excluding them from wake-up time calculation while preserving their data.
