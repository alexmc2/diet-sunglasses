'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ImageData {
  id: string;
  url: string;
  width: number;
  height: number;
  caption?: string;
  alt?: string;
}

interface PhotoSlideshowProps {
  images: ImageData[];
  initialIndex?: number;
}

export default function PhotoSlideshow({
  images,
  initialIndex = 0,
}: PhotoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(5000);
  const [isPlaying, setIsPlaying] = useState(true);
  const [recentIndices, setRecentIndices] = useState<number[]>([initialIndex]);

  const currentImage = images[currentIndex];
  const nextImage = nextIndex !== null ? images[nextIndex] : null;

  const transition = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;

      setNextIndex(newIndex);
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setNextIndex(null);
        setIsTransitioning(false);
      }, 1200);
    },
    [isTransitioning]
  );

  const getRandomIndex = useCallback(() => {
    // Keep track of recent images to avoid repetition
    const recentCount = Math.min(Math.floor(images.length / 3), 10);
    const recent = recentIndices.slice(-recentCount);
    
    // Get available indices (not in recent list)
    const availableIndices = images
      .map((_, index) => index)
      .filter(index => !recent.includes(index));
    
    // If all images have been shown recently, reset but exclude current
    if (availableIndices.length === 0) {
      return images
        .map((_, index) => index)
        .filter(index => index !== currentIndex)
        [Math.floor(Math.random() * (images.length - 1))];
    }
    
    // Pick a random index from available ones
    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
  }, [currentIndex, images, recentIndices]);

  const goToNext = useCallback(() => {
    const newIndex = getRandomIndex();
    transition(newIndex);
    setRecentIndices(prev => [...prev, newIndex].slice(-Math.min(images.length - 1, 10)));
  }, [getRandomIndex, transition, images.length]);


  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleIntervalChange = (newInterval: number) => {
    setAutoPlayInterval(newInterval);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && images.length > 1 && !isTransitioning) {
        goToNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, images.length, isTransitioning, goToNext]);

  return (
    <>
      <div className="absolute inset-0 top-24 bottom-20 overflow-hidden">
        {/* Image container that fills space between header and controls */}
        <div className="w-full h-full md:p-20 p-4">
          <div className="relative w-full h-full overflow-hidden">
            {/* Current image - only show when not transitioning to prevent overlap */}
            {!isTransitioning && currentImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || `Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                  sizes="100vw"
                />
              </div>
            )}

            {/* During transition: show both images with clip-path */}
            {isTransitioning && (
              <>
                {/* Current image (being replaced) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    clipPath: 'inset(0 0 0 0)',
                    animation: 'hideRight 1.2s ease-in-out forwards',
                  }}
                >
                  {currentImage && (
                    <Image
                      src={currentImage.url}
                      alt={currentImage.alt || `Photo ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      priority
                      sizes="100vw"
                    />
                  )}
                </div>

                {/* Next image (being revealed) */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    clipPath: 'inset(0 100% 0 0)',
                    animation: 'wipeRight 1.2s ease-in-out forwards',
                  }}
                >
                  {nextImage && (
                    <Image
                      src={nextImage.url}
                      alt={nextImage.alt || `Photo ${nextIndex! + 1}`}
                      fill
                      className="object-contain"
                      priority
                      sizes="100vw"
                    />
                  )}
                </div>

                {/* Scanner line */}
                <div
                  className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-r from-transparent via-slate-500 to-transparent z-50 pointer-events-none"
                  style={{
                    animation: 'scanLineMove 1.2s ease-in-out forwards',
                  }}
                />
              </>
            )}
          </div>
        </div>

        {!isTransitioning && currentImage?.caption && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center px-4 md:px-16">
            <p className="text-slate-200 text-lg tracking-tight md:text-xl">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center px-4 md:px-8 ">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-slate-200"
              >
                <rect x="5" y="4" width="2" height="8" fill="currentColor" />
                <rect x="9" y="4" width="2" height="8" fill="currentColor" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-slate-200"
              >
                <path d="M5 4L11 8L5 12V4Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <Select
            value={String(autoPlayInterval)}
            onValueChange={(value) => handleIntervalChange(Number(value))}
          >
            <SelectTrigger
              className="w-[50px] h-7 text-xs text-slate-200 border-slate-600"
              aria-label="Change slideshow speed"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" side="top" align="center">
              <SelectItem value="3000">3s</SelectItem>
              <SelectItem value="5000">5s</SelectItem>
              <SelectItem value="8000">8s</SelectItem>
              <SelectItem value="10000">10s</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={goToNext}
            className="p-2 rounded-full hover:bg-white/10  transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-slate-200"
            >
              <path
                d="M8 14L12 10L8 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
