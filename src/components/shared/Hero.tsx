'use client';

import { Media, ReturnData } from '@/types/api';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { getRandomElement, numberToMonth } from '@/lib/utils';
import RenderVideo from './video';
import Link from 'next/link';

export const Hero = ({ data }: { data: ReturnData }) => {
  const [randomElement, setRandomElement] = React.useState<Media | null>(null);
  const [trailer, setTrailer] = React.useState<any>(null);
  const [isTrailerEnabled, setIsTrailerEnabled] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('watchTrailer');
      if (savedState !== null) {
        setIsTrailerEnabled(JSON.parse(savedState));
      }
    }
  }, []);

  React.useEffect(() => {
    const filteredResults = data.results.filter(
      (a) =>
        a.status !== 'NOT_YET_RELEASED' &&
        a.trailer &&
        (a.bannerImage || a.coverImage)
    );
    setRandomElement(getRandomElement(filteredResults) as Media);
  }, [data.results]);

  React.useEffect(() => {
    async function fetchTrailer(trailerId: string) {
      try {
        const response = await fetch(
          `https://pipedapi.kavin.rocks/streams/${trailerId.split('?v=')[1]}`
        );
        const { videoStreams } = await response.json();
        const item = videoStreams.find(
          (i: any) => i.quality === '1080p' && i.format === 'WEBM'
        );
        setTrailer(item);
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setTrailer(undefined);
      }
    }

    if (randomElement?.trailer) {
      fetchTrailer(randomElement.trailer);
    }
  }, [randomElement?.trailer]);

  if (!randomElement) {
    return null;
  }

  const bannerOrCoverImage =
    randomElement.bannerImage || randomElement.coverImage;

  return (
    <div className='overflow-hidden'>
      <div className='relative'>
        {isTrailerEnabled && trailer && trailer.url ? (
          <RenderVideo trailer={trailer.url} />
        ) : (
          <Image
            draggable={false}
            src={bannerOrCoverImage!}
            alt={randomElement?.title?.english ?? randomElement?.title.romaji}
            width={1920}
            height={920}
            className='aspect-video max-h-[300px] min-w-[500px] overflow-hidden rounded-lg object-cover md:max-h-[350px] md:min-w-[1000px] lg:max-h-[600px] lg:min-w-[2000px] lg:max-w-[2000px]'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-r from-transparent from-[80%] to-background'></div>
        <div className='absolute inset-0 bg-gradient-to-l from-transparent from-[80%] to-background'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-transparent from-[80%] to-background'></div>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background'>
          <div className='ml-5 flex h-full flex-col justify-end gap-8'>
            <div>
              <div className='flex gap-3'>
                <h3
                  style={{ color: randomElement?.color ?? '#FFFFFF' }}
                  className='line-clamp-1 max-w-[75%]'
                >
                  {randomElement?.title.romaji}
                </h3>
              </div>
              <h1 className='line-clamp-2 max-w-[70%] text-3xl font-bold lg:max-w-[55%] lg:text-5xl'>
                {randomElement?.title.english ?? randomElement?.title.romaji}
              </h1>
            </div>
            <div>
              <div className='flex items-center gap-3 font-semibold'>
                <h1>{randomElement.format}</h1>
                <div className='size-[5px] rounded-full bg-white font-bold'></div>
                <h1>
                  {randomElement.startDate?.day}{' '}
                  {numberToMonth(randomElement.startDate?.month!)}{' '}
                  {randomElement.startDate?.year}
                </h1>
                <div className='size-[5px] rounded-full bg-white font-bold'></div>
                <h1 style={{ color: randomElement.color ?? 'pink' }}>
                  {randomElement.status}
                </h1>
              </div>
              <div
                className='hidden max-w-[50%] md:line-clamp-2 lg:line-clamp-4 xl:line-clamp-4 2xl:line-clamp-4'
                dangerouslySetInnerHTML={{
                  __html: randomElement.description!.replace(/<br>/g, ''),
                }}
              />
            </div>
            <div className='flex justify-start'>
              <Link
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/info/${randomElement.id}?releasing=${randomElement.status === 'RELEASING'}#watch`}
              >
                <Button color='primary'>Watch Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
