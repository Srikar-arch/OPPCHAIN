import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function Topbar() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const initial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : 'S';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-white/[0.06] bg-surface-900/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Status dot */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Online
      </div>

      {/* Notification */}
      <button
        className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
      </button>

      {/* Avatar */}
      <button
        onClick={() => navigate('/profile')}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white transition-transform hover:scale-105"
        aria-label="Student profile"
        title={profile.name || 'Student Profile'}
      >
        {initial}
      </button>
    </header>
  );
}
