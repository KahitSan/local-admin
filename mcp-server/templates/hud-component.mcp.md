# HUD Component Template

## TypeScript Interface Pattern
```typescript
interface HudComponentProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'default' | 'large';
  className?: string;
  disabled?: boolean;
}
```

## Required CSS Classes

* `.hud-{component}` - Base component class
* `.hud-{component}-{variant}` - Variant classes
* `.hud-{component}-{size}` - Size classes

## Mandatory Styling Elements

1. Angular clip-path: `clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));`
2. Digital font for labels: `font-family: var(--ks-font-digital);`
3. Uppercase text: `text-transform: uppercase;`
4. Scan line hover effect:

```css
::before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.2), transparent);
  animation: scan-line 0.3s ease;
}
```

## Component Structure
```tsx
const HudComponent: React.FC<HudComponentProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`hud-component ${variant !== 'default' ? `hud-component-${variant}` : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};
```

