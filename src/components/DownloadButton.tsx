'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DownloadButtonProps {
  id: string;
  type: 'file' | 'folder';
  variant?: 'icon' | 'button';
  className?: string;
}

export function DownloadButton({ id, type, variant = 'icon', className = '' }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    
    // Create an invisible anchor tag to trigger the download
    const url = `/api/download/${type}/${id}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Reset loading state after a short delay since we can't easily detect when the stream starts
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  };

  if (variant === 'button') {
    return (
      <button 
        onClick={handleDownload}
        disabled={downloading}
        className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      >
        {downloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="font-medium text-sm">Download</span>
      </button>
    );
  }

  // Icon variant (for tables, cards)
  return (
    <button 
      onClick={handleDownload}
      disabled={downloading}
      className={`p-2 text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors ${className}`}
      title="Download"
    >
      {downloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </button>
  );
}
