'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteButton({ 
  id, 
  type, 
  url,
  onDelete 
}: { 
  id: string; 
  type: 'file' | 'folder';
  url?: string;
  onDelete: (id: string, url?: string) => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      setLoading(true);
      await onDelete(id, url);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-white/80 dark:bg-neutral-900/80 hover:bg-red-50 dark:hover:bg-red-500/20 text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-500 rounded-xl backdrop-blur-md transition-colors"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
