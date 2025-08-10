import { cn } from "../../../utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  variant?: 'default' | 'timer' | 'status';
  className?: string;
  showValue?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'var(--ks-hud-primary)',
  variant = 'default',
  className,
  showValue = false,
  icon,
  label
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClasses = {
    default: "h-2",
    timer: "h-8",
    status: "h-3"
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2 text-xs">
          <span style={{ color: 'var(--ks-hud-secondary)' }}>{label}</span>
          {showValue && (
            <span className="hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      
      <div 
        className={cn(
          "bg-black/30 rounded border border-white/10 overflow-hidden",
          variantClasses[variant]
        )}
      >
        <div
          className="h-full transition-all duration-1000 rounded relative progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: `${color}40`
          }}
        >
          <div
            className="absolute top-0 right-0 w-1 h-full animate-pulse"
            style={{ backgroundColor: color }}
          />
        </div>
        
        {variant === 'timer' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {icon}
              <span 
                className="text-sm hud-mono transition-all duration-300 scale-100"
                style={{ color }}
              >
                {showValue ? `${value}/${max}` : `${Math.round(percentage)}%`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};