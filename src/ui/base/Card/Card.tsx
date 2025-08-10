import { cn } from "../../../utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'panel';
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  accentColor = 'var(--ks-hud-primary)'
}) => {
  const baseClasses = "relative overflow-hidden";
  
  const variantClasses = {
    default: "border rounded-lg",
    glass: "hud-glass hud-clip-card hud-accent-border hud-scan-line hud-interactive",
    panel: "hud-panel rounded-md"
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={variant === 'glass' ? { borderLeftColor: accentColor } : {}}
    >
      {children}
    </div>
  );
};