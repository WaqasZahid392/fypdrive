'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2 } from 'lucide-react';
import { saveFileRecord } from '@/actions/files';
import { useRouter } from 'next/navigation';

export default function FileUpload({ folderId = null }: { folderId?: string | null }) {
  const router = useRouter();

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'}
      onSuccess={async (result: any) => {
        const info = result?.info;
        if (!info || typeof info === 'string') return;

        const fileType = info.format || info.original_extension || info.secure_url?.split('.').pop() || 'file';
        const fileName = info.original_filename || (info.public_id ? info.public_id.split('/').pop() : 'Untitled');
        await saveFileRecord(fileName, info.secure_url, info.bytes || 0, fileType, folderId);
        router.refresh();
      }}
    >
      {({ open, isLoading }) => {
        return (
          <Button
            onClick={() => {
              if (!isLoading && typeof open === 'function') {
                open();
              }
            }}
            disabled={isLoading}
            variant="outline"
            className="border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 rounded-xl disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Loading...' : 'Upload File'}
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
