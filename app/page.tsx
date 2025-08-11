import { getImages } from './actions';
import PhotoSlideshow from '@/components/photo-slideshow';
import Header from '@/components/header';

export default async function Home() {
  const { images, error } = await getImages();

  if (error || images.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-200">
            {error ? 'Failed to load images' : 'No images found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <PhotoSlideshow images={images} />
      </main>
    </div>
  );
}
