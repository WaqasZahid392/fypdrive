'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { saveFileRecord } from '@/actions/files';
import { useRouter } from 'next/navigation';

export default function FileUpload({ folderId = null }: { folderId?: string | null }) {
  const router = useRouter();

  return (
    <CldUploadWidget
      uploadPreset="ml_default" // Unsigned upload preset
      onSuccess={async (result: any) => {
        const info = result.info;
        const fileType = info.format || info.original_extension || info.secure_url.split('.').pop() || 'file';
        const fileName = info.original_filename || (info.public_id ? info.public_id.split('/').pop() : 'Untitled');
        await saveFileRecord(fileName, info.secure_url, info.bytes, fileType, folderId);
        router.refresh();
      }}
    >
      {({ open }) => {
        return (
          <Button onClick={() => open()} variant="outline" className="border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 rounded-xl">
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        );
      }}
    </CldUploadWidget>
  );
}
