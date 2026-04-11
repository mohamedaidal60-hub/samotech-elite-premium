import React, { useState } from 'react';
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
  Menu,
  X,
  User as UserIcon,
  Bell,
  Search,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
    { name: 'Administration', icon: Users, path: '/admin', roles: ['super_admin', 'admin'] },
    { name: 'RH & Pointage', icon: Clock, path: '/hr', roles: ['super_admin', 'admin', 'hr'] },
    { name: 'Production', icon: PhoneCall, path: '/production', roles: ['super_admin', 'admin', 'teleoperator', 'supervisor', 'production_director'] },
    { name: 'Logistique', icon: Truck, path: '/logistics', roles: ['super_admin', 'admin', 'driver', 'sector_manager'] },
    { name: 'Qualité', icon: ShieldCheck, path: '/quality', roles: ['super_admin', 'admin', 'quality_agent'] },
    { name: 'Portail Agent', icon: UserIcon, path: '/agent' },
    { name: 'Portail Driver', icon: MapPin, path: '/driver' },
  ];

  const filteredNav = navItems.filter(item => 
    !item.roles || (user && (item.roles.includes(user.role) || user.role === 'super_admin'))
  );

  return (
    <div className="flex h-screen bg-[#06090f] text-slate-200 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-slate-800 bg-[#0d121c] p-6 relative">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">GROWTH <span className="text-cyan-400">PARTNERS</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">ERP Elite Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }
              `}
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">{item.name}</span>
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeTab"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
          {user?.role === 'super_admin' && (
            <NavLink 
              to="/settings"
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all
                ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <Settings size={20} />
              <span className="font-medium text-sm">Paramètres Pro</span>
            </NavLink>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-rose-500 hover:bg-rose-500/10 transition-all font-medium text-sm"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        `}</style>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 bg-[#0d121c]/50 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 z-30">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg">GP <span className="text-cyan-400">ERP</span></span>
          </div>

          <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2 w-96 group focus-within:border-blue-500/50 transition-all">
            <Search size={18} className="text-slate-500 group-focus-within:text-blue-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-300 placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0d121c]"></span>
            </button>
            
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold mt-1">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center text-white ring-2 ring-slate-800 ring-offset-2 ring-offset-[#06090f]">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="avatar" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0d121c] border-r border-slate-800 p-6 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <ShieldCheck className="text-white" size={18} />
                  </div>
                  <h1 className="text-lg font-bold text-white">GROWTH <span className="text-cyan-400">PARTNERS</span></h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {filteredNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-rose-500 font-medium">
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
