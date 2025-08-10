# KahitSan HUD Design System - Refined

## Core Philosophy
- **Less is More**: Strategic use of HUD elements rather than overwhelming every component
- **Information Hierarchy**: Clear visual hierarchy with subtle HUD accents
- **Elegant Angular Geometry**: Minimal, purposeful clip-paths only on key elements
- **Refined Typography**: Mix of clean sans-serif for readability and monospace for data
- **Sophisticated Glass**: Subtle transparency with refined borders

## CSS Variables Structure
```css
/* Primary HUD Colors - Refined */
--ks-hud-primary: #C9A961;        /* Main gold - more muted */
--ks-hud-primary-glow: #E5D4A1;   /* Hover/glow state */
--ks-hud-secondary: #8A8A8A;      /* Secondary text - softer */

/* Status Colors - Less aggressive */
--ks-hud-green: #00CC88;          /* Success/online - less harsh */
--ks-hud-red: #FF4444;            /* Error/danger - softer red */
--ks-hud-orange: #FF8833;         /* Warning/pending - warmer */
--ks-hud-blue: #4A9EFF;           /* Info/links - friendlier blue */
--ks-hud-purple: #8B5CF6;         /* System stats */

/* Backgrounds - More subtle */
--ks-bg-main: #0a0a0a;
--ks-bg-glass: rgba(15, 15, 20, 0.6);      /* More transparent */
--ks-bg-glass-hover: rgba(15, 15, 20, 0.8);
--ks-bg-panel: rgba(20, 20, 25, 0.4);      /* Very subtle panels */

/* Typography */
--ks-font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
--ks-font-digital: 'JetBrains Mono', 'Fira Code', 'Monaco', monospace;
```

## Design Principles

### 1. Strategic Angular Geometry
- **Primary Cards Only**: Use angular clip-paths only on main content cards
- **Subtle Angles**: Small corner cuts (4px-8px) instead of aggressive angles
- **Clean Buttons**: Regular rounded buttons with subtle borders, angular only for primary actions

### 2. Typography Hierarchy
- **Headers**: Clean sans-serif (Inter) for readability
- **Data/Codes**: Monospace only for numerical data, codes, and technical info
- **Body Text**: Clean sans-serif for better readability
- **Digital Labels**: Monospace only for field labels that represent data types

### 3. Glass Effects - Refined
- **Subtle Transparency**: Lower opacity backgrounds (0.4-0.6)
- **Minimal Blur**: Lighter backdrop blur (4px-8px)
- **Clean Borders**: 1px borders with subtle glow only on hover

### 4. Animation Guidelines
- **Subtle Scan Lines**: Only on primary interactive elements
- **Gentle Pulses**: Slower, more elegant pulse animations
- **Micro-interactions**: Small scale transforms on hover (102%-105%)

### 5. Color Application
- **Gold Accents**: Primary gold only for key information and active states
- **Status Colors**: Use sparingly, only for actual status indicators
- **Muted Secondaries**: Softer grays for supporting text
- **High Contrast**: Ensure text remains readable

## Component Guidelines

### Cards
- Main container: Subtle angular clip-path with clean glass background
- Content areas: Clean rectangular sections with minimal styling
- Headers: Gold accent line on left edge only
- Information density: Proper spacing, not cramped

### Buttons
- Primary: Angular clip-path with gold theme
- Secondary: Clean rounded with subtle border
- Tertiary: Text-only with hover effects
- Hover: Subtle glow and slight scale increase

### Typography
- Headings: Clean, readable font with selective gold coloring
- Labels: Monospace only for technical/data labels
- Values: Monospace for numerical data, times, codes
- Description text: Clean sans-serif

### Status Indicators
- Subtle colored dots for status
- Clean progress bars with minimal styling
- Status text in appropriate colors but readable

## Responsive Design
- Use clamp() for all font sizes and spacing
- Mobile: Single column, larger touch targets
- Desktop: Multi-column grids with proper gaps
- Maintain readability at all screen sizes

## What to Avoid
- ❌ Angular clips on every element
- ❌ All-caps text everywhere
- ❌ Excessive glow effects
- ❌ Over-bright neon colors
- ❌ Too much visual noise
- ❌ Poor readability for aesthetic
- ❌ Cramped information layout