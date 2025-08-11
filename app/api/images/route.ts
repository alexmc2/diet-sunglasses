import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

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
}

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',

      max_results: 500,
      resource_type: 'image',
      context: true,
    });

    const images = result.resources.map((resource: CloudinaryResource) => ({
      id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      caption:
        resource.context?.custom?.caption || resource.context?.caption || '',
      alt: resource.context?.custom?.alt || resource.context?.alt || '',
      format: resource.format,
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
