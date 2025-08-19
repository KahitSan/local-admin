import React from 'react';
import { Users } from 'lucide-react';

interface ClientManagerHeaderProps {
  title?: string;
  subtitle?: string;
}

export function ClientManagerHeader({ 
  title = "Client Sessions",
  subtitle = "Manage active workspace sessions"
}: ClientManagerHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Users className="w-6 h-6" style={{ color: 'var(--ks-hud-primary)' }} />
      <div>
        <h2 className="text-2xl font-medium" style={{ color: 'var(--ks-hud-primary)' }}>
          {title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--ks-hud-secondary)' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
