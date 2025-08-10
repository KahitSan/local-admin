import React from 'react';
// import { Navigation } from '../../ui/sections/Navigation/Navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSessionsCount?: number;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
//   activeSessionsCount,
//   onLogout
}) => {
  return (
    <div>
      {/* <Navigation 
        activeSessionsCount={activeSessionsCount}
        onLogout={onLogout}
      /> */}
      
      <div style={{
        marginTop: '80px', // Adjust for fixed header
        maxWidth: '1400px',
        margin: '80px auto 0',
        padding: 'var(--ks-space-5)',
        position: 'relative',
        zIndex: 1
      }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;