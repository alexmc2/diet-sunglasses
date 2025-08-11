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

  const goToNext = useCallback(() => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * images.length);
    } while (newIndex === currentIndex && images.length > 1);
    transition(newIndex);
  }, [currentIndex, images.length, transition]);

  const goToPrevious = useCallback(() => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * images.length);
    } while (newIndex === currentIndex && images.length > 1);
    transition(newIndex);
  }, [currentIndex, images.length, transition]);


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
        <div className="max-w-4xl w-full flex items-center gap-4">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-slate-200"
            >
              <path
                d="M12 14L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center gap-2">
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
                className="w-[60px] h-7 text-xs text-slate-200 border-slate-600"
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
          </div>

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
