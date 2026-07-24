'use client';

import { ReturnData } from '@/types/anime-data';
import Hero from './hero';

interface HomePageType {
  trendingData: ReturnData;
}

export default function HomePage({ trendingData }: HomePageType) {
  return <Hero trendingData={trendingData} />;
}
