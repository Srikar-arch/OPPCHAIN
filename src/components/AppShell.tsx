import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

/**
 * Application shell for authenticated/interior pages.
 * Desktop: sidebar + topbar + main content.
 * Mobile: top header + bottom nav.
 */
export default function AppShell() {
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile nav */}
      <MobileNav />

      {/* Main content area */}
      <div className="lg:pl-60">
        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <Topbar />
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 pt-20 sm:px-6 lg:px-8 lg:pt-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
