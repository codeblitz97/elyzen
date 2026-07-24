'use client';

import { ConsumetAnime } from '@/types/consumet';
import { Button, Tooltip, Chip, Image, Link } from '@nextui-org/react';
import { Play, Info } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { convertStatus } from '@/lib/utils';

export default function CasualCard({ anime }: { anime: ConsumetAnime }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <div
        className='relative cursor-pointer'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
          className='overflow-hidden rounded-2xl'
        >
          <Image
            src={anime.image}
            alt={anime.title.english}
            height={400}
            isBlurred
            width={300}
            className='max-h-[285px] min-h-[285px] min-w-[220px] max-w-[220px] object-cover'
          />
        </motion.div>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 flex items-center justify-center gap-4'
          >
            <Link
              className='relative z-50'
              href={`/info/${anime.id}?releasing=${convertStatus(anime.status) === 'RELEASING'}`}
            >
              <Button className='cursor-pointer' color='primary' isIconOnly>
                <Tooltip content='Info'>
                  <Info />
                </Tooltip>
              </Button>
            </Link>
            <Link
              className='relative z-50'
              href={`/info/${anime.id}?releasing=${anime.status === 'RELEASING'}#watch`}
            >
              <Button className='cursor-pointer' isIconOnly>
                <Tooltip content='Watch'>
                  <Play />
                </Tooltip>
              </Button>
            </Link>
          </motion.div>
        )}
        <div className='absolute inset-0 top-0 z-[10]'>
          <div className='flex justify-between'>
            <Chip color='primary'>{anime.genres[0]}</Chip>
            <Chip variant={'shadow'}>{anime.type}</Chip>
          </div>
        </div>
        <h1 className='max-w-[220px] truncate font-semibold'>
          {anime.title.english ?? anime.title.romaji ?? anime.title.native}
        </h1>
        <div className='flex w-full items-start gap-2 text-sm font-semibold text-gray-700 dark:text-gray-400 md:justify-between'>
          <h1 className='flex gap-1 self-start'>
            <span className='hidden md:inline lg:inline xl:inline 2xl:inline'>
              Total Episodes:
            </span>
            <span>{anime.totalEpisodes}</span>
          </h1>
          <h1 className='mx-auto hidden md:flex md:flex-col lg:flex lg:flex-col xl:flex xl:flex-col 2xl:flex 2xl:flex-col'>
            •
          </h1>
          <h1 className='flex flex-col self-end'>{anime.status}</h1>
        </div>
      </div>
    </div>
  );
}
