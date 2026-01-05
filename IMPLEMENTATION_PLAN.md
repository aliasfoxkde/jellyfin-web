# Jellyfin Web UI/UX Enhancement - Modern Netflix-Style Interface

**Project Goal:** Transform Jellyfin Web into a modern, Netflix-like media center with full keyboard/controller support and fluid navigation across all devices.

**User:** mkinney
**Date:** January 5, 2026
**Repository:** jellyfin-web

---

## Table of Contents
1. [Research Summary](#research-summary)
2. [Technical Stack & Libraries](#technical-stack--libraries)
3. [Architecture Analysis](#architecture-analysis)
4. [Implementation Phases](#implementation-phases)
5. [Testing Strategy](#testing-strategy)
6. [Migration & Deployment](#migration--deployment)

---

## Research Summary

### Existing Netflix-Style Themes for Jellyfin

Based on research, I found several existing resources:

1. **[JellyFlix](https://github.com/prayag17/JellyFlix)** by prayag17
   - CSS-based Netflix theme for Jellyfin
   - Installation via Dashboard → General → Custom CSS
   - Pros: Quick to implement
   - Cons: Limited customization, CSS-only approach

2. **[Official CSS Customization Docs](https://jellyfin.org/docs/general/clients/css-customization/)**
   - Official Jellyfin documentation for theming
   - Supports color changes, layout modifications, sizing adjustments

3. **[Awesome Jellyfin Collection](https://github.com/awesome-jellyfin/awesome-jellyfin)**
   - Curated list of plugins and enhancements
   - Community-maintained resources

### Key Findings

**What Works:**
- Jellyfin supports CSS customization out of the box
- Community has created Netflix-like themes
- Multi-app architecture allows for modern UI refactoring
- React Router v6 enables advanced navigation patterns
- MUI component library already in use

**What's Missing:**
- No built-in keyboard shortcuts system
- No gamepad/controller support
- Limited spatial navigation for TV interfaces
- No unified input handling system
- Lack of smooth animations and transitions

---

## Technical Stack & Libraries

### Core Technologies (Already Used)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **MUI (Material UI)** - Component library
- **React Query** - Server state management
- **Sass/SCSS** - Styling
- **Webpack/Vite** - Build tools

### Recommended Additions

#### 1. Keyboard Navigation & Shortcuts
- **[Mousetrap](https://craig.is/killing/mice)** (1.6M+ weekly downloads)
  - Simple, lightweight keyboard shortcut library
  - Supports key combinations (Ctrl+P, etc.)
  - Excellent browser compatibility

- **[Hotkeys.js](https://github.com/jaywcjlove/hotkeys)** alternative
  - More feature-rich
  - Better TypeScript support

#### 2. Gamepad/Controller Support
- **[HTML5 Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)** (Native)
  - Built into modern browsers
  - No additional dependencies
  - Supports Xbox, PlayStation, generic controllers

- **[JSXinput](https://www.reddit.com/r/javascript/comments/180hv2e/jsxinput_better_gamepad_support_for_web_browsers/)**
  - Enhanced gamepad wrapper
  - Better browser compatibility
  - React-friendly

#### 3. Spatial Navigation (Netflix-style)
- **[React Spatial Navigation](https://github.com/Boskenoni/react-spatial-navigation)**
  - TV-style directional navigation
  - Focus management
  - Keyboard + gamepad support

- **Custom Implementation**
  - Based on [Netflix's spatial navigation patterns](https://netflixtechblog.com/modernizing-the-web-playback-ui-1ad2f184a5a0)
  - Uses React Context for focus management
  - Leverages existing MUI focus system

#### 4. Animation & Transitions
- **[Framer Motion](https://www.framer.com/motion/)** (25M+ weekly downloads)
  - Production-ready animation library
  - Perfect for Netflix-style transitions
  - Great TypeScript support
  - Gesture support for touch devices

- **[React Transition Group](https://reactcommunity.org/react-transition-group/)** (Alternative)
  - Lighter weight
  - Already used in many Jellyfin projects

#### 5. Testing Framework
- **[Playwright](https://playwright.dev/)**
  - E2E testing
  - Multi-browser support
  - Keyboard/mouse/gamepad event simulation
  - Visual regression testing

---

## Architecture Analysis

### Current Jellyfin Web Structure

```
src/
├── apps/
│   ├── stable/         # Classic app (main production UI)
│   ├── experimental/    # New React Query-based app
│   ├── dashboard/      # Admin interface
│   └── wizard/         # Setup wizard
├── components/         # Shared components
├── themes/            # MUI theme definitions
├── hooks/             # Custom React hooks
├── lib/               # Libraries (globalize, apiclient, etc.)
└── utils/             # Utility functions
```

### Strategy: Multi-App Approach

**Recommendation:** Build new UI as a **separate app** (`src/apps/modern/`) rather than modifying `stable/`

**Benefits:**
- No breaking changes to existing UI
- A/B testing possible
- Gradual migration path
- Safe rollback
- Parallel development

**Implementation Path:**
1. Create `src/apps/modern/` with modern UI
2. Share components from `src/components/`
3. Keep `stable/` as fallback
4. User can switch between apps in settings
5. Eventually deprecate `stable/`

---

## Implementation Phases

### Phase 0: Foundation & Setup (Week 1)

**Objectives:**
- Set up development environment
- Create modern app structure
- Install dependencies
- Set up testing framework

**Tasks:**
1. ✅ Create `src/apps/modern/` directory structure
2. Install new dependencies (Framer Motion, Mousetrap, etc.)
3. Set up Playwright for E2E testing
4. Create base theme configuration
5. Set up CI/CD for automated testing

**Deliverables:**
- New app scaffold
- Working development environment
- Test suite passing
- Documentation updated

**Commit:** `feat(modern): create modern app foundation`

---

### Phase 1: Enhanced Navigation System (Weeks 2-3)

**Objectives:**
- Implement keyboard shortcuts system
- Add spatial navigation
- Create focus management
- Build navigation components

**Tasks:**

#### 1.1 Keyboard Shortcuts System
```typescript
// src/apps/modern/hooks/useKeyboardShortcuts.ts
- Global shortcuts: / (search), Esc (back), ? (help)
- Navigation: Arrow keys, Enter, Backspace
- Playback: Space (play/pause), F (fullscreen), M (mute)
- Volume: +/- keys
- Seek: Left/Right arrows (5s), Shift+arrows (30s)
```

**Implementation:**
- Create `useKeyboardShortcuts` hook using Mousetrap
- Create `ShortcutOverlay` component (press ? to see)
- Add customizable shortcuts in user settings
- Conflict detection with browser shortcuts

#### 1.2 Spatial Navigation
```typescript
// src/apps/modern/contexts/FocusContext.tsx
- Directional navigation (up/down/left/right)
- Focus management
- Visible item detection
- Scroll boundaries
```

**Features:**
- Arrow keys navigate between items
- Enter to select
- Esc to go back
- Auto-scroll to keep focused item visible
- Support for infinite lists

#### 1.3 Modern Navigation Components
```typescript
// src/apps/modern/components/navigation/
- ModernNavbar.tsx        - Top navigation bar
- Sidebar.tsx             - Collapsible sidebar
- Breadcrumbs.tsx         - Navigation path
- FocusIndicator.tsx      - Visual focus indicator
```

**Testing:**
- Unit tests for keyboard shortcuts
- E2E tests for navigation flows
- Accessibility testing (keyboard-only navigation)
- Gamepad controller testing

**Deliverables:**
- Working keyboard navigation
- Focus management system
- Shortcut help overlay
- All navigation components

**Commits:**
- `feat(modern): add keyboard shortcuts system`
- `feat(modern): implement spatial navigation`
- `feat(modern): create navigation components`

---

### Phase 2: Modern UI Components (Weeks 4-6)

**Objectives:**
- Build Netflix-style card components
- Create hero banner with video playback
- Implement smooth animations
- Design responsive layouts

**Tasks:**

#### 2.1 Card Components
```typescript
// src/apps/modern/components/media/
- MediaCard.tsx           - Standard media card
- MediaCardHover.tsx      - Hover preview card
- CardGrid.tsx            - Grid layout
- CardSlider.tsx          - Horizontal scroll
- FocusableCard.tsx       - Focus-aware card
```

**Features:**
- Hover animations (scale, fade, video preview)
- Auto-playing video on hover
- Progress indicators for watched items
- Quality badges (4K, HDR, etc.)
- Focus indicators for keyboard/controller

#### 2.2 Hero Banner
```typescript
// src/apps/modern/components/layout/
- HeroBanner.tsx          - Featured content banner
- HeroVideo.tsx           - Background video player
- HeroInfo.tsx            - Content details
- HeroActions.tsx         - Play/My List buttons
```

**Features:**
- Full-width hero section
- Auto-playing video background
- Smooth transitions between items
- Keyboard/controller navigation
- Mobile responsive

#### 2.3 Modern Layout
```typescript
// src/apps/modern/components/layout/
- ModernLayout.tsx        - Main layout wrapper
- ContentSection.tsx      - Section container
- ContinueWatching.tsx    - Resume playback section
- RecentlyAdded.tsx       - New content section
- Recommended.tsx         - Personalized recommendations
```

**Features:**
- Horizontal scrolling rows (Netflix-style)
- Lazy loading images
- Virtual scrolling for large lists
- Skeleton loading states
- Smooth scroll animations

#### 2.4 Animations with Framer Motion
```typescript
// src/apps/modern/animations/
- fadeIn.ts               - Fade transitions
- slideIn.ts              - Slide animations
- scaleIn.ts              - Scale effects
- stagger.ts              - Staggered list animations
```

**Animations:**
- Page transitions (fade, slide)
- Card hover effects (scale, shadow)
- List item stagger (cascade effect)
- Modal/overlay transitions
- Smooth scrolling

**Deliverables:**
- Complete modern UI component library
- Hero banner with video
- Animated card components
- Responsive layouts
- Design system documentation

**Commits:**
- `feat(modern): add media card components`
- `feat(modern): implement hero banner`
- `feat(modern): create layout components`
- `feat(modern): add animations with framer-motion`

---

### Phase 3: Gamepad & Controller Support (Weeks 7-8)

**Objectives:**
- Add HTML5 Gamepad API integration
- Map controller buttons to actions
- Create controller-specific UI hints
- Support multiple controller types

**Tasks:**

#### 3.1 Gamepad Integration
```typescript
// src/apps/modern/hooks/useGamepad.ts
- Detect connected controllers
- Poll gamepad state (60fps)
- Map buttons to actions
- Handle connection/disconnection
```

**Controller Mappings:**
- **Xbox Controller:**
  - A/B: Select/Back
  - D-Pad: Navigate
  - Left Stick: Navigate (with acceleration)
  - Right Stick: Scroll
  - LT/RT: Seek/Volume
  - Start/Select: Play/Pause, Settings

- **PlayStation DualShock:**
  - ×/○: Select/Back
  - D-Pad: Navigate
  - Left Stick: Navigate
  - R1/L1: Page up/down
  - Options: Settings

- **Generic:**
  - Button 0-3: A/B/X/Y equivalent
  - D-Pad: Navigation
  - Axis 0-1: Left stick

#### 3.2 Controller UI Hints
```typescript
// src/apps/modern/components/gamepad/
- ControllerHint.tsx       - Show button prompts
- ControllerSettings.tsx   - Controller configuration
- VibrationFeedback.tsx    - Haptic feedback (if supported)
```

**Features:**
- Dynamic button hints based on context
- Visual controller on screen for help
- Vibration feedback for events
- Controller settings page

#### 3.3 Input Abstraction Layer
```typescript
// src/apps/modern/lib/inputManager.ts
- Unified input handling
- Keyboard → Controller mapping
- Input priority system
- Conflict resolution
```

**Benefits:**
- Single source of truth for input
- Easy to add new input types
- Consistent behavior across devices

**Deliverables:**
- Working gamepad support
- Multiple controller mappings
- Controller UI hints
- Input settings page
- Vibration feedback

**Commits:**
- `feat(modern): add HTML5 gamepad API integration`
- `feat(modern): implement controller mappings`
- `feat(modern): create controller UI hints`
- `feat(modern): build input abstraction layer`

---

### Phase 4: Polish & Optimization (Weeks 9-10)

**Objectives:**
- Performance optimization
- Accessibility improvements
- Mobile responsiveness
- User testing & feedback

**Tasks:**

#### 4.1 Performance
```typescript
- Code splitting by route
- Lazy load components
- Image optimization (WebP, lazy loading)
- Virtual scrolling for large lists
- Memoization (React.memo, useMemo)
- Bundle size optimization
```

#### 4.2 Accessibility
```typescript
- ARIA labels and roles
- Keyboard-only navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- Focus indicators
```

#### 4.3 Mobile Responsiveness
```typescript
- Touch gestures (swipe, pinch)
- Mobile-optimized layouts
- PWA support
- Offline capability
```

#### 4.4 User Testing
```typescript
- Internal testing with mkinney credentials
- Feedback collection
- Bug fixes
- Performance tuning
```

**Deliverables:**
- Optimized build
- Accessible UI
- Mobile-responsive
- User testing report
- Bug fixes

**Commits:**
- `perf(modern): optimize bundle size and performance`
- `a11y(modern): improve accessibility`
- `style(modern): enhance mobile responsiveness`
- `test(modern): user testing and bug fixes`

---

## Testing Strategy

### Unit Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Coverage Goals:**
- Components: 80%+
- Hooks: 90%+
- Utils: 95%+

### E2E Testing with Playwright

**Setup:**
```bash
npm install -D @playwright/test
```

**Test Scenarios:**
```typescript
// tests/e2e/navigation.spec.ts
- Navigate home with keyboard
- Navigate media library with arrow keys
- Search with Ctrl+K
- Play video with Space
- Navigate back with Esc

// tests/e2e/gamepad.spec.ts
- Navigate with D-pad
- Select with A button
- Seek with triggers
- Test all controller types

// tests/e2e/ui.spec.ts
- Hero banner auto-plays
- Cards animate on hover
- Focus moves correctly
- Layout is responsive
```

**Visual Regression Testing:**
```bash
# Take screenshots
npm run test:screenshots

# Compare against baseline
npm run test:visual
```

### Manual Testing Checklist

**Keyboard Shortcuts:**
- [ ] Arrow keys navigate items
- [ ] Enter selects focused item
- [ ] Esc goes back
- [ ] / opens search
- [ ] ? shows shortcuts overlay
- [ ] Space plays/pauses
- [ ] F toggles fullscreen
- [ ] M toggles mute
- [ ] +/- adjusts volume

**Gamepad/Controller:**
- [ ] D-pad navigates
- [ ] A button selects
- [ ] B button goes back
- [ ] Left stick scrolls smoothly
- [ ] Right stick seeks
- [ ] Triggers adjust volume
- [ ] Menu button opens settings

**Animations:**
- [ ] Cards scale on hover
- [ ] Hero video plays smoothly
- [ ] Page transitions are smooth
- [ ] No janky animations
- [ ] Reduced motion respected

**Performance:**
- [ ] Initial load < 3s
- [ ] Navigation feels instant
- [ ] Scrolling is smooth (60fps)
- [ ] No memory leaks
- [ ] Bundle size < 500KB

**Accessibility:**
- [ ] All functionality accessible by keyboard
- [ ] Focus indicators visible
- [ ] Screen reader works
- [ ] ARIA labels correct
- [ ] High contrast mode works

---

## Migration & Deployment

### Development Workflow

**Branch Strategy:**
```
master              - Production (stable app)
  └── modern        - Modern app development branch
      ├── phase-1   - Navigation system
      ├── phase-2   - UI components
      ├── phase-3   - Gamepad support
      └── phase-4   - Polish & optimization
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `style`: UI/styling change
- `test`: Adding/updating tests
- `docs`: Documentation
- `refactor`: Code refactoring
- `chore`: Build/config changes

**Examples:**
```
feat(modern): add keyboard shortcuts system

- Implement useKeyboardShortcuts hook
- Add ShortcutOverlay component
- Map common shortcuts (/, Esc, Space, etc.)
- Add customization in user settings

Closes #1
```

### Deployment Process

**1. Build for Production**
```bash
npm run build:production
```

**2. Test Build Locally**
```bash
npm run serve:dist
# Visit http://localhost:8096
```

**3. Deploy to Server**
```bash
# SSH to server
ssh user@192.168.1.201

# Backup current version
sudo cp -r /opt/jellyfin/usr/share/jellyfin/web /opt/jellyfin/usr/share/jellyfin/web.backup

# Copy new build
sudo cp -r dist/* /opt/jellyfin/usr/share/jellyfin/web/

# Restart Jellyfin
sudo systemctl restart jellyfin
```

**4. Verify Deployment**
```bash
# Check service status
sudo systemctl status jellyfin

# View logs
sudo journalctl -u jellyfin -f

# Test in browser
curl -I http://192.168.1.201:8096
```

### Rollback Procedure

**If Something Goes Wrong:**
```bash
# SSH to server
ssh user@192.168.1.201

# Stop Jellyfin
sudo systemctl stop jellyfin

# Restore backup
sudo rm -rf /opt/jellyfin/usr/share/jellyfin/web
sudo mv /opt/jellyfin/usr/share/jellyfin/web.backup /opt/jellyfin/usr/share/jellyfin/web

# Restart Jellyfin
sudo systemctl start jellyfin

# Verify
sudo systemctl status jellyfin
```

### Deployment to New Machine

**Automated Script:**
```bash
#!/bin/bash
# deploy.sh - Deploy Jellyfin Web to new server

SERVER=$1
BUILD_DIR="./dist"

if [ -z "$SERVER" ]; then
  echo "Usage: ./deploy.sh user@server"
  exit 1
fi

# Build
echo "Building..."
npm run build:production

# Copy to server
echo "Deploying to $SERVER..."
scp -r $BUILD_DIR/* $SERVER:/tmp/jellyfin-web/

# Install on server
ssh $SERVER << 'ENDSSH'
sudo systemctl stop jellyfin
sudo rm -rf /opt/jellyfin/usr/share/jellyfin/web
sudo mkdir -p /opt/jellyfin/usr/share/jellyfin/web
sudo mv /tmp/jellyfin-web/* /opt/jellyfin/usr/share/jellyfin/web/
sudo systemctl start jellyfin
sudo systemctl status jellyfin
ENDSSH

echo "Deployment complete!"
```

**Usage:**
```bash
chmod +x deploy.sh
./deploy.sh mkinney@192.168.1.201
```

---

## Success Criteria

### Must Have (MVP)
- ✅ Full keyboard navigation
- ✅ Spatial navigation (arrow keys)
- ✅ Keyboard shortcuts overlay
- ✅ Netflix-style hero banner
- ✅ Animated media cards
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ E2E tests passing

### Should Have (Phase 1+)
- ✅ Gamepad/controller support
- ✅ Smooth animations
- ✅ Performance optimized
- ✅ Mobile gestures
- ✅ Customizable shortcuts
- ✅ Multiple themes
- ✅ PWA support

### Could Have (Future)
- ⏳ Voice control
- ⏳ Eye tracking support
- ⏳ AI-powered recommendations UI
- ⏳ Social features (watch together)
- ⏳ Advanced analytics dashboard

---

## Risk Assessment & Mitigation

### Risks

**1. Breaking Changes to Existing UI**
- **Risk:** High
- **Impact:** Users lose familiar interface
- **Mitigation:** Separate app, gradual migration, user choice

**2. Performance Degradation**
- **Risk:** Medium
- **Impact:** Slower load times, janky animations
- **Mitigation:** Performance testing, lazy loading, code splitting

**3. Browser Compatibility**
- **Risk:** Medium
- **Impact:** Some browsers don't support features
- **Mitigation:** Progressive enhancement, fallbacks, polyfills

**4. Gamepad API Limitations**
- **Risk:** Low
- **Impact:** Not all controllers work perfectly
- **Mitigation:** Support multiple mappings, user customization

**5. Maintenance Overhead**
- **Risk:** Medium
- **Impact:** Two UIs to maintain
- **Mitigation:** Share components, eventual deprecation of old UI

---

## Timeline

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Phase 0: Foundation | 1 week | Week 1 | Week 1 |
| Phase 1: Navigation | 2 weeks | Week 2 | Week 3 |
| Phase 2: UI Components | 3 weeks | Week 4 | Week 6 |
| Phase 3: Gamepad Support | 2 weeks | Week 7 | Week 8 |
| Phase 4: Polish & Testing | 2 weeks | Week 9 | Week 10 |
| **Total** | **10 weeks** | | |

---

## Next Steps

1. **Review and approve this plan** with mkinney
2. **Set up development environment** with all dependencies
3. **Create Phase 0 tasks** in GitHub Issues
4. **Begin implementation** of Phase 0
5. **Weekly progress reviews** with demos

---

## Resources

### Research Sources
- [JellyFlix Theme](https://github.com/prayag17/JellyFlix)
- [Jellyfin CSS Customization](https://jellyfin.org/docs/general/clients/css-customization/)
- [Awesome Jellyfin](https://github.com/awesome-jellyfin/awesome-jellyfin)
- [HTML5 Gamepad API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)
- [Netflix Tech Blog](https://netflixtechblog.com/modernizing-the-web-playback-ui-1ad2f184a5a0)
- [Mousetrap Library](https://craig.is/killing/mice)
- [Framer Motion](https://www.framer.com/motion/)
- [Playwright Testing](https://playwright.dev/)
- [React Spatial Navigation](https://github.com/Boskenoni/react-spatial-navigation)

### Inspiration
- [Netflix UI Patterns](https://medium.com/@pieecia/create-a-netflix-video-player-with-react-player-typescript-and-styled-components-2142b8003d07)
- [Smart TV Dev Toolkit](https://github.com/smarttv-dev/smart-tv)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

---

**Last Updated:** January 5, 2026
**Status:** Ready for Implementation
**Owner:** Claude Code (with mkinney oversight)
