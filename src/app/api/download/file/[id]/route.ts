import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { files } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchCloudinaryAsset, getFullFilename } from '@/lib/download';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch file from database
    const fileResult = await db.select().from(files).where(eq(files.id, id));
    if (fileResult.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    const file = fileResult[0];

    // Fetch the file from Cloudinary (with fallback for restricted assets like PDF)
    const response = await fetchCloudinaryAsset(file.url, file.type);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from Cloudinary: ${response.status} ${response.statusText}`);
    }

    const filename = getFullFilename(file.name, file.type);

    // Set headers to force download with proper filename encoding
    const headers = new Headers();
    const safeAsciiFilename = filename.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '');
    const encodedFilename = encodeURIComponent(filename);
    headers.set('Content-Disposition', `attachment; filename="${safeAsciiFilename}"; filename*=UTF-8''${encodedFilename}`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    if (response.headers.get('Content-Length')) {
      headers.set('Content-Length', response.headers.get('Content-Length')!);
    }

    // Stream the file back to the client
    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
