import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-black overflow-hidden flex-col md:flex-row transition-colors">
      {/* Sidebar - Desktop */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-neutral-950 border-t md:border-t-0 border-neutral-200 dark:border-neutral-800 relative mb-16 md:mb-0 transition-colors">
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
