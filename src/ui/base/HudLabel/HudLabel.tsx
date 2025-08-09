
interface HudLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const HudLabel: React.FC<HudLabelProps> = ({
  children,
  htmlFor,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`hud-label ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};