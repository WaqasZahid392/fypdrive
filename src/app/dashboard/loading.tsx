import { Folder } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full shrink-0"></div>
          <div>
            <div className="w-48 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2"></div>
            <div className="w-64 h-4 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg hidden md:block"></div>
          </div>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
          <div className="h-10 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mt-8">
        <div className="w-24 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-4"></div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 aspect-square flex flex-col p-3 sm:p-6 items-center justify-center relative overflow-hidden">
              {/* Shimmer effect inside the card */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-200/40 dark:via-neutral-800/20 to-transparent"></div>
              
              <div className="p-3 sm:p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl sm:rounded-3xl mb-2 sm:mb-6">
                <Folder className="w-10 h-10 sm:w-16 sm:h-16 text-neutral-300 dark:text-neutral-700" />
              </div>
              <div className="w-20 sm:w-32 h-4 sm:h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md mb-2"></div>
              <div className="w-12 sm:w-20 h-3 sm:h-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
