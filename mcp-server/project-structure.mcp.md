# KahitSan Project Structure

This document reflects the **current folder & file structure** of the KahitSan project.
It is AI-readable for context when creating, modifying, or removing components, layouts, pages, and related assets.

```bash
├── ./
├── tsconfig.node.json
├── index.html
├── tsconfig.app.json
├── mcp-server/
│   ├── coworking-domain.mcp.md
│   ├── kahitsan-server.ts
│   ├── project-structure.mcp.md
│   ├── design-system.mcp.md
│   ├── templates/
│   │   ├── hud-component.mcp.md
│   ├── component-architecture.mcp.md
├── README.md
├── public/
│   ├── assets/
│   │   ├── favicon/
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon.ico
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── site.webmanifest
│   │   │   ├── favicon-32x32.png
│   │   ├── image/
│   │   ├── logo.png
├── .gitignore
├── package-lock.json
├── package.json
├── .env
├── scripts/
│   ├── update-project-structure.sh
├── tsconfig.json
├── eslint.config.js
├── vite.config.ts
├── src/
│   ├── ui/
│   │   ├── sections/
│   │   │   ├── ClientManager/
│   │   │   │   ├── ClientManager.tsx
│   │   │   ├── LockControl/
│   │   │   │   ├── LockControl.tsx
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx
│   │   │   ├── AccessCodes/
│   │   │   │   ├── AccessCodes.tsx
│   │   │   ├── index.ts
│   │   │   ├── QuickStats/
│   │   │   │   ├── QuickStats.tsx
│   │   │   ├── SystemStats/
│   │   │   │   ├── SystemStats.tsx
│   │   ├── composite/
│   │   │   ├── PricingDisplay/
│   │   │   │   ├── PricingDisplay.tsx
│   │   │   ├── ClientCard/
│   │   │   │   ├── ClientCard.tsx
│   │   │   ├── index.ts
│   │   ├── base/
│   │   │   ├── FUTURE_EXTRACTION
│   │   │   ├── HudLabel/
│   │   │   │   ├── HudLabel.tsx
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   ├── FormGroup/
│   │   │   │   ├── FormGroup.tsx
│   │   │   ├── ProgressBar/
│   │   │   │   ├── ProgressBar.tsx
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   ├── index.ts
│   │   │   ├── Select/
│   │   │   │   ├── Select.tsx
│   │   │   ├── StatusBadge/
│   │   │   │   ├── StatusBadge.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── types/
│   │   ├── index.ts
│   ├── .DS_Store
│   ├── constants/
│   ├── utils/
│   │   ├── index.ts
│   ├── index.css
│   ├── styles/
│   │   ├── design-system.css
│   ├── layouts/
│   │   ├── AdminLayout/
│   │   │   ├── AdminLayout.tsx
│   ├── vite-env.d.ts
│   ├── hooks/
│   │   ├── useKeyPress.ts
│   │   ├── useToggle.ts
│   │   ├── useClients.ts
│   │   ├── useInterval.ts
│   │   ├── useClickOutside.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useSessionTimer.ts
│   │   ├── usePrevious.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   ├── useDebounce.ts
│   │   ├── useApi.ts
│   │   ├── index.ts
│   │   ├── useWindowSize.ts
│   │   ├── useTimer.ts
│   ├── data/
│   │   ├── sampleData.ts
│   ├── assets/
│   │   ├── favicon/
│   │   │   ├── favicon-16x16.png
│   │   │   ├── favicon.ico
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── site.webmanifest
│   │   │   ├── favicon-32x32.png
│   │   ├── image/
│   │   ├── logo.png
│   ├── pages/
```
