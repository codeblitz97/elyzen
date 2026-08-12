'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, Tv, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Result } from '@/types/anime-data';
import { ViewTransition } from 'react';

export default function AnimeCard({ anime }: { anime: Result }) {
  const cover = anime.coverImage || '';
  const title = anime.title?.userPreferred || 'Untitled';
  const rating = anime.rating ? (anime.rating / 10).toFixed(1) : 'N/A';
  const episodes = anime.totalEpisodes || 0;
  const type = anime.type || '??';
  const duration = anime.duration || '0';

  return (
    <Link
      href={`/info/${anime.id}`}
      className='group block w-full max-w-43 cursor-pointer space-y-2.5'
    >
      <ViewTransition name={`anime-info-${anime.id}`}>
        <motion.div
          className='bg-muted relative h-60 w-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-1'
          initial='initial'
          whileHover='hover'
        >
          {cover && (
            <Image
              src={cover}
              alt={title}
              fill
              sizes='(max-width: 768px) 50vw, 170px'
              className='object-cover'
            />
          )}

          <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
            <Play className='size-8 fill-white' />
          </div>

          <div className='absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md'>
            <Star className='size-3.5 fill-amber-400 text-amber-400' />
            <span>{rating}</span>
          </div>

          <motion.button
            className='absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md'
            variants={{
              initial: { scale: 0, opacity: 0 },
              hover: { scale: 1, opacity: 1 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              e.preventDefault();
              alert('do something cool');
            }}
          >
            <Plus className='size-4' />
          </motion.button>

          <div className='absolute bottom-2.5 left-2.5 flex items-center gap-1.5'>
            <div className='flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md'>
              <Tv className='size-3 text-white/80' />
              <span>{episodes}</span>
            </div>
          </div>
        </motion.div>

        <div className='space-y-0.5 px-0.5'>
          <div className='flex items-center gap-1.5'>
            {anime.status === 'RELEASING' ? (
              <span className='size-1.5 shrink-0 rounded-full bg-emerald-500' />
            ) : (
              <span className='size-1.5 shrink-0 rounded-full bg-stone-500' />
            )}
            <h3 className='text-foreground group-hover:text-primary truncate text-sm font-semibold transition-colors'>
              {title}
            </h3>
          </div>

          <p className='text-muted text-xs'>
            {type} · {duration}m
          </p>
        </div>
      </ViewTransition>
    </Link>
  );
}
