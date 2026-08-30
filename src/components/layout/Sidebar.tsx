import Link from 'next/link';
import { Cloud, Settings, LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';
import { getAllFolders } from '@/actions/folders';
import { getAllFiles } from '@/actions/files';
import TreeView from '@/components/layout/TreeView';

export default async function Sidebar() {
  const allFolders = await getAllFolders();
  const allFiles = await getAllFiles();
  
  // Calculate exact storage based on actual files in DB
  const totalBytes = allFiles.reduce((acc, file) => acc + file.size, 0);
  const usageGB = totalBytes / (1024 * 1024 * 1024);
  const limitGB = 25; // 25 GB free tier limit
  const percent = (usageGB / limitGB) * 100;

  return (
    <div className="hidden md:flex w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 flex-col h-screen transition-colors">
      <div className="p-6 flex items-center space-x-3 text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800/50">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Cloud className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Vault</span>
      </div>
      
      <TreeView folders={allFolders} files={allFiles} />
      
      <div className="p-4 mx-4 mb-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">Storage</span>
          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400">{percent.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-950 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.max(1, percent)}%` }}></div>
        </div>
        <div className="mt-3 text-[10px] text-neutral-500 font-medium">
          {usageGB === 0 ? '0.00' : (usageGB < 0.01 ? '< 0.01' : usageGB.toFixed(2))} GB of {limitGB} GB Used
        </div>
      </div>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        <Link href="/dashboard/settings" className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 text-red-500 dark:text-red-400 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Lock Vault</span>
          </button>
        </form>
      </div>
    </div>
  );
}
