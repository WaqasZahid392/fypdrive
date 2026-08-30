'use server'

import { db } from '@/db';
import { files } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function saveFileRecord(name: string, url: string, size: number, type: string, folderId: string | null = null) {
  await db.insert(files).values({
    name,
    url,
    size,
    type,
    folderId,
  });
  
  revalidatePath('/dashboard');
  revalidateTag('cloudinary-usage');
}

export async function getFiles(folderId: string | null = null) {
  if (folderId) {
    return await db.select().from(files).where(eq(files.folderId, folderId)).orderBy(files.createdAt);
  }
  return await db.select().from(files).where(isNull(files.folderId)).orderBy(files.createdAt);
}

export async function getAllFiles() {
  return await db.select().from(files).orderBy(files.createdAt);
}

export async function deleteFile(id: string, url?: string) {
  if (url) {
    try {
      const parts = url.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const publicId = filenameWithExt.split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.error("Cloudinary delete error:", e);
    }
  }

  await db.delete(files).where(eq(files.id, id));
  revalidatePath('/dashboard');
  revalidateTag('cloudinary-usage');
  return { success: true };
}

export async function renameFile(id: string, newName: string) {
  await db.update(files).set({ name: newName }).where(eq(files.id, id));
  revalidatePath('/dashboard');
  return { success: true };
}
