'use server'

import { v2 as cloudinary } from 'cloudinary';
import { unstable_cache } from 'next/cache';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getCloudinaryUsage = unstable_cache(
  async () => {
    try {
      const result = await cloudinary.api.usage();
      return {
        usage: result.credits.usage,
        limit: result.credits.limit,
        percent: result.credits.used_percent
      };
    } catch (e) {
      console.error('Failed to fetch Cloudinary usage:', e);
      return { usage: 0, limit: 25, percent: 0 };
    }
  },
  ['cloudinary-usage'],
  { tags: ['cloudinary-usage'], revalidate: 3600 }
);
