import { cn } from "../../../utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  containerClassName,
  type = 'text',
  ...props
}) => {
  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label className="text-xs block" style={{ color: 'var(--ks-hud-secondary)' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-3 py-2 rounded-md border transition-all duration-200 focus:outline-none",
          type === 'number' ? 'hud-mono' : '',
          className
        )}
        style={{
          backgroundColor: 'var(--ks-bg-panel)',
          borderColor: 'rgba(201, 169, 97, 0.3)',
          color: 'var(--ks-hud-text)'
        }}
        {...props}
      />
      {error && (
        <p className="text-xs" style={{ color: 'var(--ks-hud-red)' }}>
          {error}
        </p>
      )}
    </div>
  );
};
