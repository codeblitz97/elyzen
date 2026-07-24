'use client';

import { Tooltip, Link, Image } from '@nextui-org/react';
import Badge from '../ui/badge';
import NextLink from 'next/link';
import { Result, SeasonalMedia } from '@/types/anime-data';
import { Smile, Meh, Frown } from 'lucide-react';
import { getBrightnessScore } from '@/lib/utils';
import { motion } from 'framer-motion';

type CardProps = {
  anime: Result | SeasonalMedia;
};

export const getRatingIcon = (rating: number) => {
  if (rating >= 75) {
    return <Smile className='text-green-400' />;
  } else if (rating > 50) {
    return <Meh className='text-yellow-400' />;
  } else {
    return <Frown className='text-red-400' />;
  }
};

export const Card = ({ anime }: Readonly<CardProps>) => {
  const calculateTimeRemaining = (airingAt: number) => {
    const currentTime = Date.now();
    const timeRemaining = airingAt * 1000 - currentTime;
    return timeRemaining;
  };

  const getDays = (time: number) =>
    `${isNaN(Math.floor(time / (1000 * 60 * 60 * 24))) ? 'unknown' : Math.floor(time / (1000 * 60 * 60 * 24))} days`;

  return (
    <>
      <motion.div key={anime.id}>
        <Tooltip
          placement='right'
          content={
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-5'>
                <h1 className='text-lg font-bold'>
                  {(anime as Result).season && !anime.nextAiringEpisode
                    ? `${(anime as Result).season} ${anime.year}`
                    : `Ep ${(anime as SeasonalMedia).nextAiringEpisode?.episode ?? 1} airing in ${getDays(calculateTimeRemaining(anime.nextAiringEpisode?.airingAt!))}`}
                </h1>
                {(anime as Result).rating ? (
                  <div className='flex items-center gap-1'>
                    {getRatingIcon((anime as Result).rating)}
                    <p className='text-lg'>{(anime as Result).rating}%</p>
                  </div>
                ) : null}
              </div>
              <div>
                <div
                  style={{ color: anime.color ?? '#FFFFFF' }}
                  className='font-semibold'
                >
                  {(anime as Result).studios.map((s) => (
                    <p key={s}>{s}</p>
                  ))}
                </div>
                <div className='font-semibold'>
                  {anime.format === 'TV' ? 'TV Show' : anime.format}{' '}
                  {(anime as Result).totalEpisodes
                    ? `• ${(anime as Result).totalEpisodes} episodes`
                    : ''}
                </div>
              </div>
              {anime.genres ? (
                <div className='flex gap-2'>
                  {anime.genres.slice(0, 3).map((genre) => (
                    <div
                      key={genre}
                      style={{
                        color:
                          getBrightnessScore(anime.color ?? '#FFFFFF') >= 70
                            ? '#000000'
                            : '#FFFFFF',
                      }}
                    >
                      <Badge rounded='full' color={anime.color ?? '#FFFFFF'}>
                        <p className='font-extrabold'>{genre}</p>
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          }
        >
          <motion.div whileHover={{ color: anime.color ?? '#FFFFFF' }}>
            <Link
              className='flex flex-col items-start justify-start gap-2 text-sm'
              as={NextLink}
              href={`/info/${anime.id}`}
            >
              <Image
                alt={anime.title.english}
                radius='sm'
                isBlurred
                src={anime.coverImage}
                className='max-h-[185px] min-h-[185px] max-w-[125px] min-w-[125px] object-cover md:max-h-[265px] md:min-h-[265px] md:max-w-[185px] md:min-w-[185px] lg:max-h-[265px] lg:min-h-[265px] lg:max-w-[185px] lg:min-w-[185px] xl:max-h-[265px] xl:min-h-[265px] xl:max-w-[185px] xl:min-w-[185px]'
              />
              <motion.p
                className='max-w-[185px] text-gray-900 dark:text-gray-300'
                whileHover={{ color: anime.color ?? '#FFFFFF' }}
              >
                {anime.title.english ?? anime.title.romaji}
              </motion.p>
            </Link>
          </motion.div>
        </Tooltip>
      </motion.div>
    </>
  );
};
