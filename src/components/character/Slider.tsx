'use client';

import { InfoMediaEdge } from '@/lib/info';
import { Link, Image } from '@nextui-org/react';
import NextLink from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export const CharacterAnimeSlider = ({
  animes,
}: {
  animes: InfoMediaEdge[];
}) => {
  return (
    <Carousel opts={{ align: 'start' }} className='relative w-full'>
      <CarouselContent>
        {animes.map((anime) => (
          <CarouselItem
            className='basis-1/2 md:basis-1/3 lg:basis-1/5'
            key={anime.id}
          >
            <Link
              className='flex flex-col'
              href={`/info/${anime.node.id}`}
              key={anime.id}
              as={NextLink}
            >
              <Image
                isBlurred
                radius='sm'
                className='max-h-[185px] min-h-[185px] max-w-[125px] min-w-[125px] object-cover md:max-h-[265px] md:min-h-[265px] md:max-w-[185px] md:min-w-[185px] lg:max-h-[265px] lg:min-h-[265px] lg:max-w-[185px] lg:min-w-[185px] xl:max-h-[265px] xl:min-h-[265px] xl:max-w-[185px] xl:min-w-[185px]'
                src={
                  anime.node.coverImage.extraLarge ??
                  anime.node.coverImage.large! ??
                  anime.node.coverImage.medium!
                }
                alt={anime.node.title.romaji!}
              />
              <div className='line-clamp-1 max-w-[125px] min-w-[125px] md:max-w-[185px] md:min-w-[185px] lg:max-w-[185px] lg:min-w-[185px] xl:max-h-[265px] xl:max-w-[185px] xl:min-w-[185px]'>
                {anime.node.title.english ?? anime.node.title.romaji}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='absolute left-0 z-[50]' />
      <CarouselNext className='absolute right-0 z-[50]' />
    </Carousel>
  );
};
