import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Building, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  Settings,
  Menu,
  LogOut,
  Circle
} from 'lucide-react';

interface NavigationProps {
  activeSessionsCount?: number;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSessionsCount = 3,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'spaces', icon: Building, label: 'Spaces' },
    { id: 'access', icon: Shield, label: 'Access' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      alert('Logout clicked');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hud-glass border-b-2" 
         style={{ borderBottomColor: 'var(--ks-hud-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 hud-clip-minimal flex items-center justify-center"
                   style={{ 
                     backgroundColor: 'var(--ks-hud-primary)', 
                     color: '#000' 
                   }}>
                <span className="text-sm font-bold hud-mono">K</span>
              </div>
              <h1 className="text-xl font-medium" style={{ color: 'var(--ks-hud-primary)' }}>
                KahitSan Admin
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNav === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200
                      ${isActive 
                        ? 'hud-accent-border' 
                        : 'hover:bg-white/5'
                      }
                    `}
                    style={{
                      color: isActive ? 'var(--ks-hud-primary)' : 'var(--ks-hud-text)',
                      backgroundColor: isActive ? 'rgba(201, 169, 97, 0.1)' : 'transparent'
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Circle className="w-2 h-2 fill-current" style={{ color: 'var(--ks-hud-green)' }} />
                <span style={{ color: 'var(--ks-hud-text)' }}>Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-2 h-2 fill-current" style={{ color: 'var(--ks-hud-orange)' }} />
                <span className="hud-mono" style={{ color: 'var(--ks-hud-text)' }}>
                  {activeSessionsCount} Active
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                  Admin User
                </div>
                <div className="text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                  Super Admin
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                   style={{ 
                     backgroundColor: 'var(--ks-hud-primary)', 
                     color: '#000' 
                   }}>
                A
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                color: 'var(--ks-hud-red)'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md hover:bg-white/5 transition-colors"
              style={{ color: 'var(--ks-hud-text)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-white/10">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNav === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                      ${isActive 
                        ? 'hud-accent-border' 
                        : 'hover:bg-white/5'
                      }
                    `}
                    style={{
                      color: isActive ? 'var(--ks-hud-primary)' : 'var(--ks-hud-text)',
                      backgroundColor: isActive ? 'rgba(201, 169, 97, 0.1)' : 'transparent'
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Status */}
              <div className="pt-3 border-t border-white/10 mt-3">
                <div className="flex justify-between text-xs px-3 py-2">
                  <span style={{ color: 'var(--ks-hud-secondary)' }}>Status:</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current" style={{ color: 'var(--ks-hud-green)' }} />
                      <span style={{ color: 'var(--ks-hud-text)' }}>Online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-current" style={{ color: 'var(--ks-hud-orange)' }} />
                      <span className="hud-mono" style={{ color: 'var(--ks-hud-text)' }}>
                        {activeSessionsCount} Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;