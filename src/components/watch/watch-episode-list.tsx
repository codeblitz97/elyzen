'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Provider, Episode } from '@/types/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import _, { List } from 'lodash';
import { Input } from '../ui/input';
import { AnilistInfo } from '@/lib/info';
import { Image } from '@nextui-org/react';
import useDeviceDetector from '@/hooks/use-device-detector';

interface Props {
  animeData: Provider[];
  id: string;
  currentlyWatching: number;
  info: AnilistInfo;
  defaultProvider?: string;
  defaultLanguage?: 'sub' | 'dub';
}

const AnimeViewer: React.FC<Props> = ({
  animeData,
  id,
  currentlyWatching,
  info,
  defaultProvider = 'zoro',
  defaultLanguage = 'sub',
}) => {
  const [selectedProvider, setSelectedProvider] = useState<
    Provider | undefined
  >(animeData.find((p) => p.providerId === defaultProvider) || animeData[0]);
  const [language, setLanguage] = useState<'sub' | 'dub'>(defaultLanguage);
  const [episodePage, setEpisodePage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const device = useDeviceDetector();

  const handleProviderChange = (providerId: string) => {
    const provider = animeData.find((p) => p.providerId === providerId);
    setSelectedProvider(provider);
    setEpisodePage(0);
  };

  const episodes = useMemo(() => {
    return selectedProvider?.providerId === 'gogoanime'
      ? selectedProvider.episodes[language] || []
      : selectedProvider?.episodes || [];
  }, [selectedProvider, language]);

  const filteredEpisodes = useMemo(() => {
    return (episodes as Episode[]).filter(
      (episode) =>
        (episode.title ?? `Episode ${episode.number}`)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(episode.number).includes(searchQuery)
    );
  }, [searchQuery, episodes]);

  const episodeChunks = useMemo(
    () => _.chunk(filteredEpisodes as List<Episode>, 100),
    [filteredEpisodes]
  );
  const currentEpisodes = episodeChunks[episodePage] || [];

  const currentlyWatchingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentlyWatchingRef.current && !['mobile', 'tab'].includes(device)) {
      currentlyWatchingRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentlyWatching, device]);

  return (
    <div className='p-4'>
      <div className='mb-4 flex gap-3'>
        <Select onValueChange={(e) => handleProviderChange(e)}>
          <SelectTrigger
            className='w-[130px]'
            value={selectedProvider?.providerId}
          >
            <SelectValue
              placeholder={
                selectedProvider?.providerId === 'zoro'
                  ? 'hianime'
                  : selectedProvider?.providerId
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {animeData.map((provider) => (
                <SelectItem
                  key={
                    provider.providerId === 'zoro'
                      ? 'hianime'
                      : provider.providerId
                  }
                  value={provider.providerId}
                >
                  {provider.providerId === 'zoro'
                    ? 'hianime'
                    : provider.providerId}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedProvider?.providerId === 'gogoanime' && (
          <Select
            onValueChange={(e) => setLanguage(e as 'sub' | 'dub')}
            value={language}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder={language} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='sub'>Sub</SelectItem>
                <SelectItem value='dub'>Dub</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        {episodeChunks.length > 1 && (
          <Select
            onValueChange={(e) => setEpisodePage(Number(e))}
            value={String(episodePage)}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue
                placeholder={`${episodePage * 100 + 1}-${(episodePage + 1) * 100}`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {episodeChunks.map((_, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {index * 100 + 1}-{(index + 1) * 100}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <Input
          type='text'
          placeholder='Search episodes...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className='mt-20'>
        <ScrollArea className='h-[600px]'>
          {currentEpisodes.map((episode) => (
            <EpisodeCard
              ref={
                Number(episode.number) === Number(currentlyWatching)
                  ? currentlyWatchingRef
                  : null
              }
              info={info}
              isWatching={Number(episode.number) === Number(currentlyWatching)}
              key={episode.id || episode.episodeId}
              episode={episode}
              provider={selectedProvider?.providerId!}
              id={id}
              type={language}
            />
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

interface EpisodeCardProps {
  episode: Episode;
  provider: string;
  type: 'sub' | 'dub';
  id: string;
  isWatching: boolean;
  info: AnilistInfo;
}

const EpisodeCard: React.FC<
  EpisodeCardProps & React.RefAttributes<HTMLDivElement>
  // eslint-disable-next-line react/display-name
> = React.forwardRef(
  ({ episode, provider, type, id, isWatching, info }, ref) => {
    const episodeId = episode.id || episode.episodeId;
    return (
      <div
        ref={ref}
        onClick={() => {
          if (!isWatching) {
            window.location.href = `/watch/${id}?episodeId=${encodeURIComponent(episodeId!)}&provider=${provider}&type=${type}&number=${episode.number}`;
          }
        }}
        className={
          isWatching
            ? 'mb-4 flex cursor-no-drop flex-col rounded border bg-gray-100 p-4 duration-300 dark:bg-gray-700/55 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'
            : 'mb-4 flex cursor-pointer flex-col rounded border p-4 duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/55 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'
        }
      >
        <Image
          src={
            episode.img
              ? episode.img!
              : info.bannerImage
                ? info.bannerImage!
                : info.coverImage!
          }
          title={
            isWatching
              ? ''
              : episode.title
                ? episode.title
                : `Episode ${episode.number}`
          }
          alt={episode.title ? episode.title : `Episode ${episode.number}`}
          width={1600}
          height={1600}
          className='mr-4 aspect-video object-cover lg:max-h-[100px] lg:min-h-[100px] lg:min-w-[150px] lg:max-w-[150px]'
        />
        <div className='flex flex-col justify-center'>
          <h2 className='line-clamp-1 text-sm font-bold'>
            {episode.number} -{' '}
            {episode.title ? episode.title : `Episode ${episode.number}`}
          </h2>
          <p className='line-clamp-4 text-xs'>
            {episode.description
              ? episode.description
              : `Episode ${episode.number} of ${info.title.english ?? info.title.userPreferred ?? info.title.romaji ?? info.title.native}`}
          </p>
        </div>
      </div>
    );
  }
);

export default AnimeViewer;
