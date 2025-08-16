# KahitSan Component Architecture

## Structure Philosophy
- **ui/base/**: Smallest reusable HUD elements (buttons, inputs, badges)
- **ui/composite/**: Combinations of base components (cards, forms, displays)
- **ui/sections/**: Large feature sections (calendar, stats, floor plan)
- **layouts/**: Page-level wrappers with navigation
- **pages/**: Route components that compose sections

## Component Hierarchy Rules

### Base Components (ui/base/)
- MUST be completely self-contained
- MUST use only HUD design system variables
- MUST include angular clip-path styling
- MUST have hover scan-line animations
- CANNOT import other ui components
- Examples: HudButton, HudInput, HudBadge, HudToggle

### Composite Components (ui/composite/)
- MUST be built from base components only
- MUST serve a specific business purpose
- MUST be reusable across different sections
- Examples: ClientCard, StatCard, PricingDisplay, AccessCodeCard

### Section Components (ui/sections/)
- MUST be large, feature-complete areas
- CAN use base and composite components
- MUST be domain-specific (coworking related)
- MUST be placed in folders with same name as component
- Examples: ServerStats, FloorPlan, BookingCalendar, ClientManager

### Layout Components (layouts/)
- MUST provide page structure and navigation
- MUST be route-agnostic
- MUST handle responsive behavior
- Examples: AdminLayout (with nav), AuthLayout (minimal)

### Page Components (pages/)
- MUST represent a route/URL
- MUST compose sections and handle page-level state
- MUST be named after their route purpose
- Examples: Dashboard, Bookings, Members, Settings

## Folder Structure Rules

### Section Folder Convention
- Every section component must be in a folder with the same name
- Structure: `src/ui/sections/[ComponentName]/[ComponentName].tsx`
- Example: `src/ui/sections/ClientManager/ClientManager.tsx`

### Local Splits (Non-Reusable)
- Components that are not reusable across other sections go in the same folder
- Examples:
  - `src/ui/sections/ClientManager/ClientList.tsx`
  - `src/ui/sections/ClientManager/ClientCard.tsx`
  - `src/ui/sections/ClientManager/NewClientForm.tsx`

### Reusable Splits
- Components clearly reusable across multiple sections go to:
  - `src/ui/base/` for basic elements
  - `src/ui/composite/` for complex combinations

## Naming Conventions
- **Base**: Hud[ComponentName] (e.g., HudButton, HudInput)
- **Composite**: [Purpose]Card/[Purpose]Display (e.g., ClientCard, PricingDisplay)
- **Sections**: [Feature]Section or [Feature] (e.g., ServerStats, BookingCalendar)
- **Layouts**: [Context]Layout (e.g., AdminLayout, AuthLayout)
- **Pages**: [Route]Page or [Route] (e.g., Dashboard, Settings)

## Import Rules

### Component Imports
```typescript
// ✅ Base can import: Only React, hooks, utils
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

// ✅ Composite can import: Base components, hooks, utils
import { HudButton } from '../base/HudButton';
import { HudBadge } from '../base/HudBadge';

// ✅ Sections can import: Base, composite, hooks, utils
import { ClientCard } from '../composite/ClientCard';
import { HudButton } from '../base/HudButton';

// ✅ Pages can import: Sections, layouts, hooks, utils
import { ServerStats } from '../ui/sections/ServerStats';
import { AdminLayout } from '../layouts/AdminLayout';

// ❌ NEVER import upward in hierarchy
// Base cannot import composite/sections
// Composite cannot import sections
```

### Type Imports
```typescript
// From utils
import { ClientType } from '../types';

// From UI components
import { ClientType } from '../../types';

// Reuse existing core types at src/types
```

### Icons (Lucide)
```typescript
// Safe dynamic rendering
import * as Lucide from 'lucide-react';

const IconComp = (Lucide as any)[name] || (Lucide as any)['Circle'];
return <IconComp className="w-4 h-4" />;
```