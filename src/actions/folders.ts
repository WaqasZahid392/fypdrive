'use server'

import { db } from '@/db';
import { folders } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getFiles, deleteFile } from '@/actions/files';

export async function createFolder(name: string, parentId: string | null = null) {
  if (!name.trim()) return { error: 'Folder name is required' };
  
  await db.insert(folders).values({
    name,
    parentId,
  });
  
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getRootFolders() {
  return await db.select().from(folders).where(isNull(folders.parentId)).orderBy(folders.createdAt);
}

export async function getFolderById(id: string) {
  const result = await db.select().from(folders).where(eq(folders.id, id));
  return result.length > 0 ? result[0] : null;
}

export async function getAllFolders() {
  return await db.select().from(folders).orderBy(folders.createdAt);
}

export async function getChildFolders(parentId: string) {
  return await db.select().from(folders).where(eq(folders.parentId, parentId)).orderBy(folders.createdAt);
}

export async function deleteFolder(id: string) {
  // 1. Get all files in this folder and delete them (which handles Cloudinary and DB)
  const folderFiles = await getFiles(id);
  for (const file of folderFiles) {
    await deleteFile(file.id, file.url);
  }

  // 2. Get all sub-folders and recursively delete them
  const subFolders = await getChildFolders(id);
  for (const subFolder of subFolders) {
    await deleteFolder(subFolder.id); // recursive call
  }

  // 3. Finally, delete the folder itself
  await db.delete(folders).where(eq(folders.id, id));
  
  revalidatePath('/dashboard');
  return { success: true };
}

export async function renameFolder(id: string, newName: string) {
  await db.update(folders).set({ name: newName }).where(eq(folders.id, id));
  revalidatePath('/dashboard');
  return { success: true };
}
