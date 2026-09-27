import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Target,
  Map,
  Bookmark,
  UserCircle,
  Menu,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

const drawerNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/goal', label: 'My Goal', icon: Target },
  { to: '/journey', label: 'My Journey', icon: Map },
  { to: '/saved', label: 'Saved Opportunities', icon: Bookmark },
  { to: '/profile', label: 'Student Profile', icon: UserCircle },
];

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top mobile bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-surface-900/90 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2.5">
          <Logo size={24} />
          <span className="text-base font-bold text-white">OPPCHAIN</span>
        </div>
        <button
          className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Drawer menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-14 right-0 bottom-0 z-50 flex w-72 flex-col justify-between border-l border-white/[0.06] bg-surface-900/98 p-5 backdrop-blur-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <nav className="space-y-1" aria-label="Mobile drawer navigation">
                {drawerNavItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-300'
                          : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="border-t border-white/[0.06] pt-4 text-xs text-gray-600">
                OPPCHAIN v0.1 · Opportunity Intelligence
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/[0.06] bg-surface-900/95 px-2 py-1 backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
