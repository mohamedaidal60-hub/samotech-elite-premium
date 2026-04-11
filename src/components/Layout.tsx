import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Clock,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Administration', icon: Users, path: '/admin', roles: ['super_admin', 'admin'] },
    { name: 'RH & Pointage', icon: Clock, path: '/hr' },
    { name: 'Production', icon: PhoneCall, path: '/production' },
    { name: 'Logistique', icon: Truck, path: '/logistics' },
    { name: 'Qualité', icon: ShieldCheck, path: '/quality' },
  ];

  const filteredNav = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="layout-container" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside className="glass-morphism" style={{ 
        width: 'var(--sidebar-width)', 
        borderRight: '1px solid var(--border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          GROWTH <span style={{ color: 'var(--accent-secondary)' }}>PARTNERS</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '600' : '400',
              })}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user?.role === 'super_admin' && (
            <NavLink to="/settings" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Settings size={18} /> Settings
            </NavLink>
          )}
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--error)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              padding: '12px 16px',
              width: '100%',
              borderRadius: '12px',
              transition: 'background 0.2s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header className="glass-morphism" style={{ 
          height: 'var(--header-height)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px'
        }}>
          <h2 style={{ fontSize: '18px' }}>
            {navItems.find(n => n.path === location.pathname)?.name || 'Grow Partners ERP'}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{user?.role.replace('_', ' ')}</div>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}>
              {user?.name.charAt(0)}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
