import HomePage from '@/components/home/main-page';
import { getTrendingAnime } from '@/lib/anime';

export default async function Home() {
  const trendingData = await getTrendingAnime();
  return <HomePage trendingData={trendingData} />;
}
