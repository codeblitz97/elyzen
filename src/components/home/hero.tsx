'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className='text-foreground bg-background relative min-h-[70vh] w-full overflow-hidden'>
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='absolute inset-0'
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

      <div className='from-background via-background/60 absolute inset-x-0 bottom-0 z-10 h-2/3 bg-linear-to-t to-transparent' />
      <div className='from-background via-background/60 absolute inset-y-0 left-0 z-10 w-full bg-linear-to-r to-transparent md:w-2/3' />

      <div className='relative z-20 container mx-auto flex h-full min-h-[70vh] flex-col justify-end px-6 py-12 pb-24'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className='max-w-3xl'
          >
            <h1 className='text-foreground mb-6 line-clamp-2 text-4xl font-bold drop-shadow-xl md:text-6xl'>
              {activeAnime.title?.userPreferred}
            </h1>

            <div className='text-foreground/90 mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
              {activeAnime.status && (
                <Chip className='inline-flex items-center rounded-full bg-emerald-950 px-3 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20 ring-inset'>
                  {activeAnime.status}
                </Chip>
              )}
              {activeAnime.type && (
                <Chip variant='soft'>{activeAnime.type}</Chip>
              )}
              {activeAnime.format && (
                <Chip variant='soft'>{activeAnime.format}</Chip>
              )}
              {activeAnime.year && (
                <Chip variant='soft'>{activeAnime.year}</Chip>
              )}
            </div>

            {activeAnime.genres && activeAnime.genres.length > 0 && (
              <div className='mb-6 flex flex-wrap items-center gap-2'>
                {activeAnime.genres.map((genre: string) => (
                  <Chip
                    key={genre}
                    variant='tertiary'
                    className='ring-foreground/20 px-3 py-1 ring-1 backdrop-blur-sm ring-inset'
                  >
                    {genre}
                  </Chip>
                ))}
              </div>
            )}

            <div
              className='text-foreground/80 mb-8 line-clamp-3 max-w-2xl text-sm md:line-clamp-4'
              dangerouslySetInnerHTML={{
                __html: activeAnime.description || 'No description available.',
              }}
            />

            <div className='flex items-center gap-4'>
              <Button className='bg-foreground text-background px-7 py-5 font-semibold transition-transform hover:-translate-y-0.5'>
                <Play className='fill-background size-5' />
                Watch Now
              </Button>

              <Button
                variant='outline'
                className='bg-background/20 border-foreground/20 px-7 py-5 font-semibold backdrop-blur-md transition-transform hover:-translate-y-0.5'
              >
                <Info className='size-5' />
                More Info
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='pointer-events-none absolute right-0 bottom-6 left-0 z-30 container mx-auto flex items-center justify-between px-6'>
        <div className='pointer-events-auto flex items-center gap-2.5'>
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Skip to anime ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                idx === currentIndex
                  ? 'bg-focus w-8'
                  : 'bg-muted/30 hover:bg-muted/50 w-2'
              }`}
            />
          ))}
        </div>

        <div className='pointer-events-auto flex items-center gap-3'>
          <Button
            isIconOnly
            variant='tertiary'
            onClick={handlePrev}
            className='bg-background/40 hover:bg-background/70 text-foreground border-foreground/10 rounded-full border backdrop-blur-md'
            aria-label='Previous anime'
          >
            <ChevronLeft className='size-6' />
          </Button>
          <Button
            isIconOnly
            variant='tertiary'
            onClick={handleNext}
            className='bg-background/40 hover:bg-background/70 text-foreground border-foreground/10 rounded-full border backdrop-blur-md'
            aria-label='Next anime'
          >
            <ChevronRight className='size-6' />
          </Button>
        </div>
      </div>
    </div>
  );
}
