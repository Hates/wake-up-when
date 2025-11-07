# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wake up When is a Progressive Web App that calculates wake-up times based on train departure times and customizable morning routine stages. Built with React 19, Vite, Tailwind CSS, and PWA capabilities for offline use.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173

# Testing
npm test                 # Run tests in watch mode
npm test -- --run        # Run tests once (CI mode)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Building
npm run build           # Production build
npm run preview         # Preview production build locally
```

## Architecture

### State Management

The app uses React's built-in `useState` and `useEffect` hooks exclusively - no external state management library. All state lives in `src/App.jsx`:

- **trainTime**: String in HH:MM format for the target departure time
- **stages**: Array of stage objects with `{ id, name, duration, enabled }` structure
- **draggedIndex/dragOverIndex**: State for drag-and-drop reordering

Stage order matters: stages are displayed and calculated in array order, representing the chronological sequence of the morning routine.

### Time Calculation Logic

Time calculations are centralized in `src/utils/timeCalculations.js`:
- Converts train time to total minutes from midnight
- Subtracts all enabled stage durations
- Handles wrap-around for previous day (negative minutes)
- Returns formatted HH:MM string

The calculation runs reactively via `useEffect` whenever `trainTime` or `stages` change.

### Drag-and-Drop Implementation

Stage reordering uses native HTML5 drag-and-drop API (not a library):
- `draggable` attribute on stage elements
- Event handlers: `onDragStart`, `onDragOver`, `onDragLeave`, `onDrop`, `onDragEnd`
- Visual feedback via Tailwind classes during drag operations
- Reordering done via array splice operations

### PWA Configuration

PWA setup is in `vite.config.js` using `vite-plugin-pwa`:
- Auto-updates via `registerType: 'autoUpdate'`
- Workbox caches all static assets (`**/*.{js,css,html,ico,png,svg}`)
- Service worker registration happens automatically

## Testing Strategy

Tests use Vitest + React Testing Library:
- Component tests in `src/App.test.jsx`
- Utility tests in `src/utils/timeCalculations.test.js`
- Test setup in `src/test/setup.js` (includes jsdom and jest-dom matchers)
- Run single test file: `npm test -- App.test.jsx`
- Globals enabled in Vitest config for describe/it/expect

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
