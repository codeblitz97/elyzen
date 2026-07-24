'use client';

import { useEffect, useState } from 'react';
import { Button, Image, Link, Tooltip } from '@nextui-org/react';
import { Clock, Cross } from 'lucide-react';

interface Episode {
  id: string;
  epid: string;
  eptitle: string;
  aniTitle: string;
  image?: string;
  epnum: number | string;
  duration: number;
  timeWatched: number;
  subtype: string;
  createdAt: string;
}

const parseTime = (seconds: number, typeFor?: string): string => {
  const hrs = Math.floor((seconds - (typeFor === 'one' ? 3 : 0)) / 3600);
  const mins = Math.floor((seconds - (typeFor === 'one' ? 3 : 0)) / 60);
  const secs = Math.floor((seconds - (typeFor === 'one' ? 3 : 0)) % 60);
  return `${hrs}:${mins}:${secs}`;
};

const AnimeList = () => {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);

  useEffect(() => {
    const vidstackSettings = localStorage.getItem('vidstack_settings');
    if (vidstackSettings) {
      const parsedSettings = JSON.parse(vidstackSettings);
      const episodesArray = Object.values(parsedSettings);
      setEpisodes(episodesArray as Episode[]);
    }
  }, []);

  const handleClearVidstackSettings = () => {
    localStorage.removeItem('vidstack_settings');
    setEpisodes(null);
  };

  return (
    <>
      {episodes ? (
        <>
          <div className='flex items-center justify-between'>
            <h1 className='mb-4 flex gap-1 text-4xl font-bold'>
              <Clock className='size-9' /> <span>Continue Watching</span>
            </h1>
            <Tooltip content='Clear all'>
              <Button
                color='danger'
                variant='light'
                isIconOnly
                onClick={handleClearVidstackSettings}
              >
                <Cross className='rotate-45' />
              </Button>
            </Tooltip>
          </div>
          <div className='max-h-[400px] overflow-x-hidden overflow-y-scroll scrollbar-hide'>
            <div className='grid grid-cols-1 p-4 lg:grid-cols-3'>
              {episodes?.map((episode) => (
                <Link
                  className='text-foreground'
                  key={`${episode.epid}-${episode.id}`}
                  href={`/watch/${episode.id}?episodeId=${encodeURIComponent(episode.epid)}&number=${episode.epnum}&type=${episode.subtype}&provider=${episode.epid.includes('?ep=') ? 'zoro' : 'gogoanime'}`}
                >
                  <div className='my-4 max-w-[400px] rounded-lg p-4'>
                    {episode.image && (
                      <Image
                        src={episode.image}
                        alt={episode.eptitle}
                        className='max-h-[205px] min-h-[205px] min-w-[365px] max-w-[365px] rounded-lg object-cover'
                      />
                    )}
                    <h2 className='mt-2 text-lg font-semibold'>
                      {episode.eptitle}
                    </h2>
                    <h3 className='text-md font-medium'>{episode.aniTitle}</h3>
                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                      {parseTime(episode.timeWatched, 'one')} /{' '}
                      {parseTime(episode.duration)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default AnimeList;
