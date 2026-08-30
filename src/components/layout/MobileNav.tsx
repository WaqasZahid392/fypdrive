import Link from 'next/link';
import { Folder, Settings, LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around z-50 transition-colors">
      <Link href="/dashboard" className="flex flex-col items-center justify-center space-y-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-2 w-full h-full">
        <Folder className="w-5 h-5" />
        <span className="text-[10px] font-medium">Files</span>
      </Link>
      
      <Link href="/dashboard/settings" className="flex flex-col items-center justify-center space-y-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-2 w-full h-full">
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-medium">Settings</span>
      </Link>


      
      <form action={logout} className="w-full h-full">
        <button type="submit" className="w-full h-full flex flex-col items-center justify-center space-y-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2">
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Lock</span>
        </button>
      </form>
    </div>
  );
}
