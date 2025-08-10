import { cn } from "../../../utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  className?: string;
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label className="text-xs block" style={{ color: 'var(--ks-hud-secondary)' }}>
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-3 py-2 rounded-md border transition-all duration-200 focus:outline-none appearance-none",
          className
        )}
        style={{
          backgroundColor: 'var(--ks-bg-panel)',
          borderColor: 'rgba(201, 169, 97, 0.3)',
          color: 'var(--ks-hud-text)',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23C9A961' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 8px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '16px',
          paddingRight: '2.5rem'
        }}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs" style={{ color: 'var(--ks-hud-red)' }}>
          {error}
        </p>
      )}
    </div>
  );
};