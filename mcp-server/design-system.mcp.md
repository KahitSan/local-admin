# KahitSan HUD Design System

## Core Philosophy
- CLI-Inspired terminal aesthetic with Iron Man HUD elements
- Angular geometry with clip-path polygons
- Digital typography using monospace fonts
- Semi-transparent glass panels with backdrop blur
- Animated scan lines and hover effects

## CSS Variables Structure
```css
/* Primary HUD Colors */
--ks-hud-primary: #C9A961;        /* Main gold */
--ks-hud-primary-glow: #E5D4A1;   /* Hover/glow state */
--ks-hud-secondary: #999999;      /* Secondary text */

/* Status Colors */
--ks-hud-green: #00FF00;          /* Success/online */
--ks-hud-red: #FF0000;            /* Error/danger */
--ks-hud-orange: #FF6600;         /* Warning/pending */
--ks-hud-blue: #0080FF;           /* Info/links */
--ks-hud-purple: #8B5CF6;         /* System stats */

/* Backgrounds */
--ks-bg-main: #0a0a0a;
--ks-bg-glass: rgba(12, 12, 15, 0.8);
--ks-bg-glass-hover: rgba(12, 12, 15, 0.9);

/* Typography */
--ks-font-family: 'Segoe UI', system-ui, sans-serif;
--ks-font-digital: 'Courier New', 'Monaco', 'Lucida Console', monospace;
```

## Component Requirements

* ALL interactive elements must use clip-path for angular edges
* ALL headers must use --ks-font-digital and uppercase
* ALL hover effects must include scan line animation
* ALL cards must have left border accent (2px solid --ks-hud-primary)
* ALL forms must use HUD styling with glass backgrounds

## Responsive Design
* Use clamp() for all font sizes and spacing
* Mobile: Collapse to single column
* Desktop: Multi-column grids with auto-fit