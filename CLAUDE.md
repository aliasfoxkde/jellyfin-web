# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Jellyfin Web is the frontend web interface for Jellyfin, the free media server. It is a React-based SPA that serves as the primary client for web browsers and is used as the base for mobile apps.

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm start
# Same as:
npm run serve

# Build
npm run build:development    # Development build with sourcemaps
npm run build:production     # Production build
npm run build:analyze        # Bundle analysis

# Type checking
npm run build:check          # TypeScript type checking without emitting

# Code quality
npm run lint                 # ESLint
npm run stylelint            # Stylelint for CSS/SCSS

# Testing
npm test                     # Run tests once
npm run test:watch           # Watch mode

# ES5 compatibility check
npm run escheck              # Check output is ES5 compliant
npm run build:es-check       # Build and check
```

## High-Level Architecture

### Multi-App Structure

The codebase is transitioning from a monolithic structure to a multi-app architecture following [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) principles. There are currently three apps:

- **`src/apps/stable/`** - The classic, production-ready app with full feature support
- **`src/apps/experimental/`** - New architecture using React Query, TypeScript, and modern patterns
- **`src/apps/dashboard/`** - Admin dashboard interface
- **`src/apps/wizard/`** - First-time setup wizard

### App Structure Pattern

Each app follows this pattern:
- `AppLayout.tsx` - Root layout component
- `routes/routes.tsx` - Route definitions
- `routes/asyncRoutes/` - Lazy-loaded route modules
- `routes/legacyRoutes/` - Wrappers for old controllers
- `features/` - Feature-based modules (components, hooks, API, utils)
- `components/` - App-specific components

### Routing Architecture

The routing system is hybrid:
- **New routes** use React Router v6 with lazy loading via `toAsyncPageRoute()`
- **Legacy routes** are wrapped with `toViewManagerPageRoute()` for old controllers
- Route arrays are exported and composed into the final route tree

Both stable and experimental apps support async routes (new React pages) and legacy routes (old controller/view pattern).

### Feature Organization

Features are self-contained modules with:
- `components/` - Feature-specific React components
- `api/` - Custom hooks for API calls (typically using React Query)
- `hooks/` - Feature-specific React hooks
- `utils/` - Feature utilities
- `constants/` - Constants and enums
- `types.ts` - TypeScript types

Example: `src/apps/dashboard/features/backups/` contains everything related to the backup feature.

### Legacy Code Areas

These directories are deprecated or need cleanup:
- **`src/controllers/`** - Legacy page controllers (do not add new files)
- **`src/scripts/`** - Mixed utilities and components (being refactored)
- **`src/elements/`** - Old webcomponents (being replaced)

### Shared Components

**`src/components/`** contains reusable, app-agnostic components:
- `cardbuilder/` - Media item card components
- `listview/` - List view components
- `mediainfo/` - Media metadata display components
- `common/` - Shared UI primitives
- `toolbar/` - Application toolbar components
- `router/` - Routing utilities (AsyncRoute, LegacyRoute, ErrorBoundary)

### Libraries

**`src/lib/`** contains reusable libraries:
- `globalize/` - Custom localization system
- `jellyfin-apiclient/` - Legacy API client support
- `legacy/` - Browser polyfills
- `navdrawer/` - Navigation drawer component
- `scroller/` - Scrolling utilities

### Plugins System

**`src/plugins/`** contains dynamically-loaded features:
- Each player (htmlVideoPlayer, htmlAudioPlayer, etc.) is a plugin
- Plugins register themselves and are loaded at runtime
- SyncPlay is a complex multi-user synchronization plugin

### State Management

- **React Query** (`@tanstack/react-query`) - Server state for API calls
- **React Context** - App-wide state (themes, user settings)
- **Jellyfin SDK** (`@jellyfin/sdk`) - Generated API client with axios
- **Legacy Events** - Custom event system in `src/utils/events.ts`

### Styling

- **Sass/SCSS** - Primary styling approach
- **MUI** (`@mui/material`) - Component library (dashboard, experimental app)
- **Emotion** - CSS-in-JS for MUI theming
- **`src/themes/`** - Theme definitions
- **`src/styles/`** - Global stylesheets

### TypeScript Configuration

- Strict mode enabled
- Base URL is `src/` for imports
- Target is ES5 with DOM libraries
- React 17+ JSX transform

### Build System

- **Webpack** - Main bundler (dev, prod, analyze configs)
- **Vitest** - Test runner with jsdom environment
- **Babel** - Transpilation with React and TypeScript presets
- **Fork TS Checker** - Fast TypeScript type checking

### Import Restrictions for Tree-Shaking

ESLint restricts barrel imports to enable better tree-shaking:
- ❌ `import { Icon } from '@mui/icons-material'`
- ✅ `import Icon from '@mui/icons-material/Icon'`
- Same rule applies to `@mui/material`, `@jellyfin/sdk` generated clients

### Testing

Tests are located alongside source files:
- `*.test.ts` - Unit tests for utilities and hooks
- Vitest with jsdom environment
- Test files use Vitest's built-in assertions

### Localization

- **`src/strings/`** - Translation JSON files
- Only modify `en-us.json` - other languages are managed via Weblate
- Use the globalize system for runtime translations

### API Integration

Modern API calls use the Jellyfin SDK with custom hooks:
```typescript
// Import directly for tree-shaking
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import type { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

// Create a custom hook
const useUserInfo = (userId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserApi(api).getUserId({ userId })
    });
    return data;
};
```

Legacy code uses `window.ApiClient` or creates SDK instances manually.

### Browser Compatibility

Target browsers are defined in `package.json` (browserslist):
- Last 2 versions of Chrome, Firefox, Safari, Edge
- iOS > 10
- Older Chrome versions (27, 38, 47, 53, 56, 63)
- Firefox ESR

Polyfills are loaded for:
- Promise, fetch (whatwg-fetch)
- ResizeObserver, IntersectionObserver
- Core-js methods (Object.assign, Array.from, etc.)
- Custom Element registration
- TextEncoder

## Development Workflow

### Adding a New Feature

1. Determine which app (stable/experimental/dashboard) the feature belongs to
2. Create a feature directory: `src/apps/{app}/features/{featureName}/`
3. Add components, hooks, API calls, and types as needed
4. Create a route in `src/apps/{app}/routes/asyncRoutes/`
5. Add to the route exports and import in `routes.tsx`

### Modifying Existing Features

- Check if the feature lives in `apps/` or legacy `controllers/`/`scripts/`
- Prefer modifying the React component in `apps/` over legacy code
- Legacy controllers use the ViewManager system and are HTML-first

### Working with Legacy Code

When modifying legacy areas (`controllers/`, `scripts/`, `elements/`):
- Be aware these use jQuery and custom event systems
- They rely on global `ApiClient`, `Events`, `Dashboard` objects
- Prefer migrating to React/TypeScript when possible

### Debugging Routes

- Check both `routes.tsx` and `asyncRoutes/` for route definitions
- Legacy routes may be defined in both the new system and old ViewManager
- The `FallbackRoute` component catches unmatched paths

### Linting and Formatting

- ESLint runs on all `src/**/*.{js,jsx,ts,tsx}` files
- Stylelint checks CSS/SCSS files
- Files are automatically checked on save in VS Code
- The project uses 4-space indentation
- Single quotes are preferred for strings

## Important Notes

- **Node.js >= 20.0.0** and **npm >= 9.6.4 < 11.0.0** are required
- Yarn is no longer supported; use npm
- The build produces ES5 output with sourcemaps
- All strings must be added to `en-us.json` for translation
- MUI components should be imported directly, not from barrel exports
- Tests should be placed next to the files they test with `.test.ts` suffix
