'use client';

import {
  Result,
  ReturnData,
  SeasonalMedia,
  UpcomingSeasonalReturnData,
} from '@/types/anime-data';
import { Card } from '../shared/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type CardProps = {
  animeData: ReturnData | UpcomingSeasonalReturnData;
};

export const HomeCards = ({ animeData }: Readonly<CardProps>) => {
  const slicedAnimeArray = animeData.results.slice(0, 15) as
    | Result[]
    | SeasonalMedia[];

  return (
    <>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='relative w-full'
      >
        <CarouselContent>
          {slicedAnimeArray.map((anime) => (
            <CarouselItem
              className='basis-1/2 md:basis-1/3 lg:basis-1/5'
              key={anime.id}
            >
              <Card anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='absolute -left-5 md:-left-10' />
        <CarouselNext className='absolute -right-1' />
      </Carousel>
    </>
  );
};
