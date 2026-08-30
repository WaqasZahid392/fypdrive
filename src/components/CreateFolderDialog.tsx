'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { createFolder } from '@/actions/folders';
import { Loader2, Plus, FolderPlus } from 'lucide-react';

export default function CreateFolderDialog({ parentId = null }: { parentId?: string | null }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await createFolder(name, parentId);
    setLoading(false);
    setName('');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
        <Plus className="w-4 h-4 mr-2" />
        New Folder
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FolderPlus className="w-5 h-5 mr-2 text-blue-500" />
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-neutral-500 dark:text-neutral-400">
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input 
            placeholder="e.g. Vacation Photos" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus-visible:ring-blue-500"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
