import { cn } from "../../../utils";

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  icon,
  className
}) => {
  const statusConfig = {
    active: {
      color: 'var(--ks-hud-green)',
      bg: 'rgba(0, 204, 136, 0.2)',
      border: 'rgba(0, 204, 136, 0.4)'
    },
    inactive: {
      color: 'var(--ks-hud-secondary)',
      bg: 'rgba(138, 138, 138, 0.2)',
      border: 'rgba(138, 138, 138, 0.4)'
    },
    warning: {
      color: 'var(--ks-hud-orange)',
      bg: 'rgba(255, 136, 51, 0.2)',
      border: 'rgba(255, 136, 51, 0.4)'
    },
    error: {
      color: 'var(--ks-hud-red)',
      bg: 'rgba(255, 68, 68, 0.2)',
      border: 'rgba(255, 68, 68, 0.4)'
    },
    info: {
      color: 'var(--ks-hud-blue)',
      bg: 'rgba(74, 158, 255, 0.2)',
      border: 'rgba(74, 158, 255, 0.4)'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded text-xs hud-mono",
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`
      }}
    >
      {icon}
      {children}
    </span>
  );
};