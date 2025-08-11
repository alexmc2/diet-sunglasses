'use server';

import { getCloudinaryImages } from '@/lib/cloudinary';

export async function getImages() {
  try {
    const images = await getCloudinaryImages();
    return { images, error: null };
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return { images: [], error: 'Failed to fetch images' };
  }
}