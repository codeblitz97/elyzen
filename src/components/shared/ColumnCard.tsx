'use client';

import { Result, SeasonalMedia } from '@/types/anime-data';
import { Image, Link, Tooltip } from '@nextui-org/react';
import { motion } from 'framer-motion';
import Badge from '../ui/badge';
import { getBrightnessScore } from '@/lib/utils';
import { getRatingIcon } from './Card';
import { FaStar } from 'react-icons/fa';

export const ColumnCard = ({
  media,
  title,
}: {
  media: Result[];
  title?: string;
}) => {
  const calculateTimeRemaining = (airingAt: number) => {
    const currentTime = Date.now();
    const timeRemaining = airingAt * 1000 - currentTime;
    return timeRemaining;
  };

  const getDays = (time: number) =>
    `${isNaN(Math.floor(time / (1000 * 60 * 60 * 24))) ? 'unknown' : Math.floor(time / (1000 * 60 * 60 * 24))} days`;

  return (
    <div className='w-full'>
      <h1 className='mt-20 text-3xl font-bold'>
        {title ? title : 'Upcoming Anime'}
      </h1>
      <div className='flex flex-col gap-4 py-6'>
        {media.map((anime, ind) => (
          <div className='flex items-center gap-4 md:gap-10' key={anime.id}>
            <h1
              className='hidden text-3xl font-bold md:block'
              style={{ color: anime.color ?? 'greenyellow', width: '50px' }} // Fixed width for the index number
            >
              #{ind + 1}
            </h1>
            <Tooltip
              placement='top'
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
                          <Badge
                            rounded='full'
                            color={anime.color ?? '#FFFFFF'}
                          >
                            <p className='font-extrabold'>{genre}</p>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              }
            >
              <Link
                className='flex-1 rounded-xl bg-slate-200 text-foreground dark:bg-neutral-800'
                href={`/info/${anime.id}`}
              >
                <div className='flex w-full items-center justify-between'>
                  <div>
                    <div className='flex items-center px-3 py-2 duration-300'>
                      <Image
                        src={anime.coverImage!}
                        alt={anime.title.english! ?? anime.title.romaji!}
                        radius='none'
                        isBlurred
                        className='max-h-[62px] min-h-[62px] min-w-[50px] max-w-[50px] object-cover'
                        width={50}
                        height={62}
                      />
                      <div className='ml-4 flex flex-col justify-between'>
                        <Tooltip
                          content={anime.title.english! ?? anime.title.romaji!}
                        >
                          <motion.h1
                            className='max-w-[210px] truncate'
                            whileHover={{ color: anime.color ?? 'greenyellow' }}
                          >
                            {anime.title.english! ?? anime.title.romaji!}
                          </motion.h1>
                        </Tooltip>
                        <div className='flex items-center gap-2'>
                          <span>{anime.season}</span>
                          <div className='h-4 w-[0.5px] bg-black dark:bg-white'></div>
                          <span>
                            {anime.startDate?.day
                              ? String(anime.startDate?.day).length >= 2
                                ? `${anime.startDate?.day}`
                                : `0${anime.startDate?.day}`
                              : '01'}
                            /
                            {String(anime.startDate?.month).length >= 2
                              ? `${anime.startDate?.month}`
                              : `0${anime.startDate?.month}`}
                            /{anime.startDate?.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-1 pr-4'>
                    <span>
                      {anime.rating ? (
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-1'>
                            <FaStar /> <span>{anime.rating / 10}</span>
                          </div>{' '}
                          |{' '}
                          {anime.status ??
                            (anime.format === 'TV'
                              ? 'TV Show'
                              : anime.format) ??
                            anime.type}
                        </div>
                      ) : (
                        <>{anime.type}</>
                      )}
                    </span>
                    <div
                      className='flex gap-2'
                      style={{
                        color:
                          getBrightnessScore(anime.color ?? '#FFFFFF') >= 70
                            ? '#000000'
                            : '#FFFFFF',
                      }}
                    >
                      {anime.genres.slice(0, 3).map((genre, i) => (
                        <Badge
                          key={`${genre}-${i}`}
                          color={anime.color ?? '#FFFFFF'}
                          rounded='full'
                          size={'sm'}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};
