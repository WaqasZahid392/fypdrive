import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { files } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch file from database
    const fileResult = await db.select().from(files).where(eq(files.id, id));
    if (fileResult.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    const file = fileResult[0];

    // Fetch the file from Cloudinary
    const response = await fetch(file.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from Cloudinary: ${response.statusText}`);
    }

    // Ensure filename has an extension
    const extension = file.name.includes('.') ? '' : `.${file.type}`;
    const filename = `${file.name}${extension}`.replace(/"/g, '');

    // Set headers to force download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Content-Length', response.headers.get('Content-Length') || file.size.toString());

    // Stream the file back to the client
    return new NextResponse(response.body, { headers });
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
