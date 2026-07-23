import { use } from 'react';
import {
  getTrendingAnime,
  getAllTimePopularAnime,
  getUpcomingNextSeason,
  getPopularThisSeasonAnime,
  top100Anime,
  getAllTimePopularMovies,
} from '@/lib/anime';
import { ReturnData } from '@/types/animeData';
import { Metadata } from 'next';
import HomeComp from './home';

export const generateMetadata = async (): Promise<Metadata> => {
  const trending = (await getTrendingAnime(1, 5)) as ReturnData;

  const trendingTitles = trending.results.map(
    (result) =>
      result.title.english ?? result.title.romaji ?? result.title.native
  );

  return {
    title: `Elyzen - Watch your favorite anime in one place`,
    description: `Watch ${trendingTitles.join(', ')} on Elyzen!`,
  };
};

export const revalidate = 3600;

export default function Home() {
  const [trending, popular, upcomingNxt, popularThis, top100, popularMovies] =
    use(
      Promise.all([
        getTrendingAnime(),
        getAllTimePopularAnime(),
        getUpcomingNextSeason(),
        getPopularThisSeasonAnime(),
        top100Anime(),
        getAllTimePopularMovies(),
      ])
    ) as [
      ReturnData,
      ReturnData,
      ReturnData,
      ReturnData,
      ReturnData,
      ReturnData,
    ];

  return (
    <HomeComp
      trending={trending}
      popular={popular}
      upcomingNxt={upcomingNxt}
      popularThis={popularThis}
      top100={top100}
      popularMovies={popularMovies}
    />
  );
}
