import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { folders, files } from '@/db/schema';
import { eq } from 'drizzle-orm';
import JSZip from 'jszip';

export const maxDuration = 60; // Set a higher timeout for large zips

// Helper to traverse the tree and get all files with their relative paths
async function getFolderFilesRecursive(folderId: string, currentPath: string = ''): Promise<{ file: typeof files.$inferSelect, path: string }[]> {
  const result: { file: typeof files.$inferSelect, path: string }[] = [];
  
  // Get all files in this folder
  const currentFiles = await db.select().from(files).where(eq(files.folderId, folderId));
  for (const f of currentFiles) {
    const extension = f.name.includes('.') ? '' : `.${f.type}`;
    result.push({ file: f, path: `${currentPath}${f.name}${extension}` });
  }

  // Get all child folders
  const childFolders = await db.select().from(folders).where(eq(folders.parentId, folderId));
  for (const cf of childFolders) {
    const subFiles = await getFolderFilesRecursive(cf.id, `${currentPath}${cf.name}/`);
    result.push(...subFiles);
  }

  return result;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch folder
    const folderResult = await db.select().from(folders).where(eq(folders.id, id));
    if (folderResult.length === 0) {
      return new NextResponse('Folder not found', { status: 404 });
    }
    const folder = folderResult[0];

    const allFiles = await getFolderFilesRecursive(id, '');

    // If folder is empty, send an empty zip
    // archiver can create an empty zip, but we can also just return a 400
    if (allFiles.length === 0) {
      return new NextResponse('Folder is empty', { status: 400 });
    }

    const zip = new JSZip();

    // Process files
    for (const { file, path } of allFiles) {
      try {
        const response = await fetch(file.url);
        if (!response.ok || !response.body) {
          console.error(`Failed to fetch file: ${file.name}`);
          continue;
        }
        
        // Fetch file as ArrayBuffer and add to zip
        const arrayBuffer = await response.arrayBuffer();
        zip.file(path, arrayBuffer);
      } catch (err) {
        console.error(`Error fetching file ${file.name}:`, err);
      }
    }

    // Generate Node Stream and convert to Web Stream
    const nodeStream = zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' });
    
    const stream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      }
    });

    const headers = new Headers();
    const filename = `${folder.name.replace(/"/g, '')}.zip`;
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', 'application/zip');

    return new NextResponse(stream, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
