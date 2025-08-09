
import React, { useState } from 'react';
import { HudButton } from '../../base';

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
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'members', icon: '👥', label: 'Members' },
    { id: 'spaces', icon: '🏢', label: 'Spaces' },
    { id: 'access', icon: '🔐', label: 'Access' },
    { id: 'billing', icon: '💰', label: 'Billing' },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
    { id: 'settings', icon: '🔧', label: 'Settings' },
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
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(12, 12, 15, 0.98)',
      borderBottom: '2px solid var(--ks-hud-primary)',
      backdropFilter: 'blur(15px)',
      zIndex: 100,
      padding: 0
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--ks-space-3) var(--ks-space-5)',
        position: 'relative'
      }}>
        {/* CLI Prompt Indicator */}
        <div style={{
          position: 'absolute',
          left: 'var(--ks-space-3)',
          top: 'var(--ks-space-1)',
          color: 'var(--ks-hud-primary)',
          fontFamily: 'var(--ks-font-digital)',
          fontSize: 'var(--ks-font-size-xs)',
          opacity: 0.7
        }}>
          ${' '}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ks-space-4)' }}>
          <a
            href="#"
            style={{
              fontSize: 'var(--ks-font-size-3xl)',
              fontWeight: 400,
              color: 'var(--ks-hud-primary)',
              fontFamily: 'var(--ks-font-digital)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'var(--ks-transition-hud)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--ks-hud-primary-glow)';
              e.currentTarget.style.textShadow = '0 0 8px var(--ks-hud-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--ks-hud-primary)';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            KAHITSAN.ADMIN
          </a>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            background: 'rgba(12, 12, 15, 0.8)',
            border: 'var(--ks-border-hud)',
            color: 'var(--ks-hud-primary)',
            padding: 'var(--ks-space-2)',
            fontSize: 'var(--ks-font-size-lg)',
            cursor: 'pointer',
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
          }}
        >
          ☰
        </button>
        
        {/* Navigation Menu */}
        <ul style={{
          display: isMobileMenuOpen || window.innerWidth > 768 ? 'flex' : 'none',
          alignItems: 'center',
          gap: 'var(--ks-space-1)',
          listStyle: 'none',
          position: window.innerWidth <= 768 ? 'absolute' : 'static',
          top: window.innerWidth <= 768 ? '100%' : 'auto',
          left: window.innerWidth <= 768 ? 0 : 'auto',
          right: window.innerWidth <= 768 ? 0 : 'auto',
          background: window.innerWidth <= 768 ? 'rgba(12, 12, 15, 0.98)' : 'transparent',
          borderBottom: window.innerWidth <= 768 ? '2px solid var(--ks-hud-primary)' : 'none',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          backdropFilter: window.innerWidth <= 768 ? 'blur(15px)' : 'none'
        }}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ks-space-2)',
                  padding: 'var(--ks-space-3) var(--ks-space-4)',
                  color: activeNav === item.id ? 'var(--ks-hud-primary)' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontFamily: 'var(--ks-font-digital)',
                  fontSize: 'var(--ks-font-size-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'var(--ks-transition-hud)',
                  border: '1px solid transparent',
                  clipPath: window.innerWidth > 768 ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  background: activeNav === item.id ? 'rgba(201, 169, 97, 0.1)' : 'transparent',
                  borderColor: activeNav === item.id ? 'rgba(201, 169, 97, 0.6)' : 'transparent',
                  borderLeft: activeNav === item.id ? '2px solid var(--ks-hud-primary)' : '1px solid transparent',
                  width: window.innerWidth <= 768 ? '100%' : 'auto',
                  justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'center',
                  borderBottom: window.innerWidth <= 768 ? '1px solid rgba(201, 169, 97, 0.1)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeNav !== item.id) {
                    e.currentTarget.style.color = 'var(--ks-hud-primary)';
                    e.currentTarget.style.borderColor = 'rgba(201, 169, 97, 0.3)';
                    e.currentTarget.style.background = 'rgba(201, 169, 97, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeNav !== item.id) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        
        {/* User Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ks-space-4)'
        }}>
          {/* Status Indicators */}
          <div style={{ display: 'flex', gap: 'var(--ks-space-3)', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ks-space-2)',
              padding: 'var(--ks-space-1) var(--ks-space-2)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'var(--ks-border-hud-thin)',
              fontFamily: 'var(--ks-font-digital)',
              fontSize: 'var(--ks-font-size-xs)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--ks-hud-green)',
                opacity: 0.9
              }} />
              <span>Online</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ks-space-2)',
              padding: 'var(--ks-space-1) var(--ks-space-2)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'var(--ks-border-hud-thin)',
              fontFamily: 'var(--ks-font-digital)',
              fontSize: 'var(--ks-font-size-xs)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--ks-hud-orange)',
                opacity: 0.9
              }} />
              <span>{activeSessionsCount} Active</span>
            </div>
          </div>
          
          {/* User Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ks-space-3)',
            padding: 'var(--ks-space-2) var(--ks-space-4)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: 'var(--ks-border-hud-thin)',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'var(--ks-hud-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--ks-font-digital)',
              fontSize: 'var(--ks-font-size-sm)',
              color: '#000',
              fontWeight: 'bold'
            }}>
              A
            </div>
            
            {window.innerWidth > 1024 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: 'var(--ks-font-digital)',
                  fontSize: 'var(--ks-font-size-sm)',
                  color: 'var(--ks-hud-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Admin User
                </div>
                <div style={{
                  fontFamily: 'var(--ks-font-digital)',
                  fontSize: 'var(--ks-font-size-xs)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase'
                }}>
                  Super Admin
                </div>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <HudButton
            variant="danger"
            onClick={handleLogout}
            style={{
              padding: 'var(--ks-space-2) var(--ks-space-4)',
              fontSize: 'var(--ks-font-size-xs)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--ks-space-2)',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </HudButton>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;