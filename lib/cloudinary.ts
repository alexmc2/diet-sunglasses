import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getCloudinaryImages() {
  interface CloudinaryResource {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      context?: {
        custom?: {
          caption?: string;
          alt?: string;
        };
        caption?: string;
        alt?: string;
      };
      format: string;
      created_at: string;
    }

    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        direction: 'desc',
        sort_by: 'created_at',
        resource_type: 'image',
        context: true,
      });

      console.log('Total images from Cloudinary:', result.resources.length);
      console.log('Image IDs:', result.resources.map((r: CloudinaryResource) => r.public_id));

      return result.resources.map((resource: CloudinaryResource) => {
        // Create an optimized URL with Cloudinary transformations
        const optimizedUrl = cloudinary.url(resource.public_id, {
          format: 'webp',
          quality: 'auto:best',
          transformation: [
            { width: 'auto', dpr: 'auto', fetch_format: 'auto' },
            { responsive: true, width: 800, crop: 'scale' },
          ],
          secure: true,
        });

        return {
          id: resource.public_id,
          url: optimizedUrl,
          width: resource.width,
          height: resource.height,
          caption: resource.context?.custom?.caption || resource.context?.caption || '',
          alt: resource.context?.custom?.alt || resource.context?.alt || '',
          format: resource.format,
          created_at: resource.created_at,
        };
      });
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Helper function to generate optimized Cloudinary URLs
export function getOptimizedImageUrl(publicId: string, width: number = 800) {
  return cloudinary.url(publicId, {
    format: 'webp',
    quality: 'auto:best',
    transformation: [
      { width: 'auto', dpr: 'auto', fetch_format: 'auto' },
      { width: width, crop: 'scale' },
    ],
    secure: true,
  });
}

export default cloudinary;