'use client';

import { useState } from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RenameButton({
  id,
  currentName,
  type,
  onRename
}: {
  id: string;
  currentName: string;
  type: 'file' | 'folder';
  onRename: (id: string, newName: string) => Promise<any>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === currentName) return;
    setLoading(true);
    await onRename(id, name);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="p-2 bg-white/80 dark:bg-neutral-900/80 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl backdrop-blur-md transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Rename {type}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
              autoFocus
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">Cancel</Button>
              <Button type="submit" disabled={loading || !name.trim() || name === currentName} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
