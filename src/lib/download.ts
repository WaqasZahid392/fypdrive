import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Ensures the filename has its proper extension and is trimmed.
 */
export function getFullFilename(name: string, type: string): string {
  const cleanName = (name || 'file').trim();
  const cleanType = (type || '').trim().toLowerCase().replace(/^\./, '');

  if (!cleanType) {
    return cleanName;
  }

  // If already ends with the extension, don't duplicate
  if (cleanName.toLowerCase().endsWith(`.${cleanType}`)) {
    return cleanName;
  }

  return `${cleanName}.${cleanType}`;
}

/**
 * Fetches an asset from Cloudinary.
 * If direct public fetch is restricted (e.g. 401 ACL deny for PDF/archive files on Cloudinary),
 * falls back to generating a signed private download URL using API credentials.
 */
export async function fetchCloudinaryAsset(fileUrl: string, fileType: string): Promise<Response> {
  // 1. Try direct public fetch
  const response = await fetch(fileUrl);
  if (response.ok) {
    return response;
  }

  // 2. Fallback to signed private download URL if direct access was restricted (e.g. 401 ACL for PDF)
  const match = fileUrl.match(/\/([^\/]+)\/upload\/(?:v\d+\/)?(.+)$/);
  if (match) {
    const resourceType = match[1];
    const publicIdWithExt = match[2];
    let publicId = publicIdWithExt;
    const format = fileType;

    if (publicIdWithExt.endsWith(`.${fileType}`)) {
      publicId = publicIdWithExt.slice(0, -(fileType.length + 1));
    }

    try {
      const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
        resource_type: resourceType,
        type: 'upload',
      });

      const signedResponse = await fetch(signedUrl);
      if (signedResponse.ok) {
        return signedResponse;
      }
    } catch (err) {
      console.error('Failed to generate signed download URL:', err);
    }
  }

  return response;
}

