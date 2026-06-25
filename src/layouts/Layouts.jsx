import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useIdeaStore } from '../stores/useIdeaStore';
import { StepIndicator } from '../components/funnel/FunnelComponents';
import { 
  IconBulb, 
  IconPlus, 
  IconFolder, 
  IconSettings, 
  IconLogout, 
  IconBell, 
  IconShield,
  IconChartBar,
  IconCode,
  IconAdjustments,
  IconUsers
} from '@tabler/icons-react';

// Layout A: PublicFunnelLayout (UIUX-03 section 4.3)
export function PublicFunnelLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const path = location.pathname;

  // Determine current wizard step node
  let currentStep = 1;
  if (path.includes('/elicitation')) currentStep = 2;
  else if (path.includes('/review')) currentStep = 3;
  else if (path.includes('/estimate')) currentStep = 4;
  else if (path.includes('/payment') || path.includes('/generating')) currentStep = 5;

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Minimal Top Bar */}
      <header className="h-14 bg-white border-b-[0.5px] border-gray-200 px-6 flex items-center justify-between z-10 select-none">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-primary to-orange-500 flex items-center justify-center text-white">
            <IconBulb className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans font-bold text-base text-gray-900 tracking-tight">IdeaForge</span>
        </Link>

        {user ? (
          <Link to="/dashboard" className="text-xs font-semibold text-gray-600 hover:text-gray-900">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/admin/login" className="text-xs font-semibold text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
        )}
      </header>

      {/* Funnel Content Centred Column (760px) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {path !== '/' && <StepIndicator currentStep={currentStep} />}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Layout B: UserPortalLayout (UIUX-03 section 4.3)
export function UserPortalLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { reset: resetIdea } = useIdeaStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    resetIdea();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Authenticated Top Nav */}
      <header className="h-14 bg-white border-b-[0.5px] border-gray-200 px-6 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-primary to-orange-500 flex items-center justify-center text-white">
              <IconBulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans font-bold text-base text-gray-900 tracking-tight">IdeaForge</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-4 text-xs font-semibold">
            <Link 
              to="/dashboard" 
              className={`px-3 py-1.5 rounded-lg ${
                location.pathname === '/dashboard' ? 'bg-amber-tint text-amber-primary' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/idea/new" 
              className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>New Idea</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 relative">
          <button className="text-gray-400 hover:text-gray-600" aria-label="Notifications">
            <IconBell className="w-5 h-5" />
          </button>
          
          {/* Avatar & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full bg-amber-tint border border-amber-primary/45 flex items-center justify-center text-amber-primary font-bold text-sm select-none cursor-pointer"
              aria-label="User menu"
            >
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border-[0.5px] border-gray-200 rounded-xl shadow-lg z-30 p-1 font-sans text-xs flex flex-col gap-0.5">
                  <div className="px-3 py-2 border-b-[0.5px] border-gray-100 text-gray-500 font-normal truncate">
                    {user?.email || 'User'}
                  </div>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <IconFolder className="w-4 h-4 text-gray-400" />
                    <span>Projects</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer font-medium"
                  >
                    <IconLogout className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        <Outlet />
      </main>
    </div>
  );
}

// Layout D: AdminLayout (UIUX-03 section 4.3)
export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const path = location.pathname;

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Analytics', path: '/admin/analytics', icon: IconChartBar },
    { label: 'Skill Manager', path: '/admin/skills', icon: IconCode },
  ];

  return (
    <div className="min-h-screen bg-paper flex font-sans">
      {/* Admin Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#1A1917] text-gray-300 flex flex-col justify-between border-r-[0.5px] border-gray-800 p-4 select-none">
        <div className="space-y-6">
          {/* Admin Wordmark */}
          <div className="flex items-center gap-2 px-2 py-1">
            <IconShield className="w-6 h-6 text-amber-primary" />
            <span className="font-bold text-white tracking-tight">IdeaForge Admin</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = path === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-amber-primary text-[#FFF8ED]' 
                      : 'hover:bg-gray-800 hover:text-white text-gray-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1.5">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <IconFolder className="w-4.5 h-4.5" />
            <span>Back to Platform</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/20 cursor-pointer"
          >
            <IconLogout className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Admin main content */}
      <main className="flex-grow p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
