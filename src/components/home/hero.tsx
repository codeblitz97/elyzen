'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ReturnData } from '@/types/anime-data';

export default function Hero({ trendingData }: { trendingData: ReturnData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const animes = trendingData?.results?.slice(0, 10) || [];

  if (animes.length === 0) return null;

  const activeAnime = animes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % animes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
  };

  const handlePanEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className='text-foreground bg-background relative min-h-[70vh] sm:min-h-[80vh] w-full overflow-hidden select-none touch-pan-y'>
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='absolute inset-0 pointer-events-none'
        >
          {activeAnime.bannerImage && (
            <Image
              fill
              priority
              alt={activeAnime.title?.userPreferred || 'Anime background'}
              src={activeAnime.bannerImage}
              className='object-cover object-center'
            />
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className='absolute inset-0 z-10 touch-pan-y cursor-grab active:cursor-grabbing'
        onPanEnd={handlePanEnd}
      />

      <div className='from-background via-background/70 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3/4 sm:h-2/3 bg-linear-to-t to-transparent' />
      <div className='from-background via-background/60 pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-linear-to-r to-transparent sm:w-2/3' />

      <div className='absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-3'>
        <Button
          isIconOnly
          variant='tertiary'
          onClick={handlePrev}
          className='bg-background/40 hover:bg-background/70 text-foreground border-foreground/10 rounded-md border backdrop-blur-md size-9 sm:size-10'
          aria-label='Previous anime'
        >
          <ChevronLeft className='size-5 sm:size-6' />
        </Button>
        <Button
          isIconOnly
          variant='tertiary'
          onClick={handleNext}
          className='bg-background/40 hover:bg-background/70 text-foreground border-foreground/10 rounded-md border backdrop-blur-md size-9 sm:size-10'
          aria-label='Next anime'
        >
          <ChevronRight className='size-5 sm:size-6' />
        </Button>
      </div>

      <div className='relative z-20 container mx-auto flex h-full min-h-[70vh] sm:min-h-[80vh] flex-col justify-end px-4 sm:px-6 py-8 sm:py-12 pb-16 sm:pb-24 pointer-events-none'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='max-w-3xl pointer-events-auto'
          >
            <h1 className='text-foreground mb-3 sm:mb-6 line-clamp-2 text-2xl font-bold drop-shadow-xl sm:text-5xl md:text-6xl'>
              {activeAnime.title?.userPreferred}
            </h1>

            <div className='text-foreground/90 mb-3 sm:mb-4 flex flex-wrap items-center gap-1.5 sm:gap-x-4 sm:gap-y-2 text-xs sm:text-sm'>
              {activeAnime.status && (
                <Chip className='inline-flex items-center rounded-full bg-emerald-950 px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20 ring-inset'>
                  {activeAnime.status}
                </Chip>
              )}
              {activeAnime.type && (
                <Chip variant='soft' size='sm'>{activeAnime.type}</Chip>
              )}
              {activeAnime.format && (
                <Chip variant='soft' size='sm'>{activeAnime.format}</Chip>
              )}
              {activeAnime.year && (
                <Chip variant='soft' size='sm'>{activeAnime.year}</Chip>
              )}
            </div>

            {activeAnime.genres && activeAnime.genres.length > 0 && (
              <div className='mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2'>
                {activeAnime.genres.slice(0, 4).map((genre: string) => (
                  <Chip
                    key={genre}
                    variant='tertiary'
                    size='sm'
                    className='ring-foreground/20 px-2 sm:px-3 py-0.5 sm:py-1 ring-1 backdrop-blur-sm ring-inset text-[11px] sm:text-xs'
                  >
                    {genre}
                  </Chip>
                ))}
              </div>
            )}

            <div
              className='text-foreground/80 mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 max-w-2xl text-xs sm:text-sm md:line-clamp-4'
              dangerouslySetInnerHTML={{
                __html: activeAnime.description || 'No description available.',
              }}
            />

            <div className='flex items-center gap-2.5 sm:gap-4'>
              <Button className='bg-foreground text-background px-5 sm:px-7 py-3 sm:py-5 text-sm font-semibold transition-transform hover:-translate-y-0.5'>
                <Play className='fill-background size-4 sm:size-5' />
                Watch Now
              </Button>

              <Button
                variant='outline'
                className='bg-background/20 border-foreground/20 px-5 sm:px-7 py-3 sm:py-5 text-sm font-semibold backdrop-blur-md transition-transform hover:-translate-y-0.5'
              >
                <Info className='size-4 sm:size-5' />
                More Info
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2.5'>
        {animes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Skip to anime ${idx + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ease-out ${
              idx === currentIndex
                ? 'bg-focus w-6 sm:w-8'
                : 'bg-muted/40 hover:bg-muted/60 w-1.5 sm:w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
