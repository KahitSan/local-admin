
interface HudCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
}

export const HudCard: React.FC<HudCardProps> = ({
  children,
  className = '',
  borderColor = 'var(--ks-hud-primary)',
}) => {
  return (
    <div
      className={`hud-card ${className}`}
      style={{
        background: 'var(--ks-bg-glass)',
        border: 'var(--ks-border-hud)',
        borderLeft: `3px solid ${borderColor}`,
        padding: 'var(--ks-space-6)',
        backdropFilter: 'blur(10px)',
        transition: 'var(--ks-transition-hud)',
      }}
    >
      {children}
    </div>
  );
};