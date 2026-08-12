'use client';

import { ReturnData } from '@/types/anime-data';
import Hero from './hero';
import AnimeCard from '../anime/anime-card';

interface HomePageType {
  trendingData: ReturnData;
}

export default function HomePage({ trendingData }: HomePageType) {
  console.log(trendingData.results);
  return (
    <>
      <Hero trendingData={trendingData} />
      <section className='flex flex-wrap gap-2'>
        {trendingData.results.map((anime) => (
          <AnimeCard anime={anime} key={anime.id}/>
        ))}
      </section>
    </>
  );
}
