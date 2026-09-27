import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Target,
  Map,
  Bookmark,
  UserCircle,
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/goal', label: 'My Goal', icon: Target },
  { to: '/journey', label: 'My Journey', icon: Map },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-white/[0.06] bg-surface-900/80 backdrop-blur-xl lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <Logo size={28} />
        <span className="text-lg font-bold tracking-tight text-white">
          OPPCHAIN
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="border-t border-white/[0.06] px-5 py-4">
        <p className="text-xs text-gray-600">OPPCHAIN v0.1</p>
      </div>
    </aside>
  );
}
