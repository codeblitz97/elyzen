'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import _ from 'lodash';
import { Input } from '../ui/input';
import { AnilistInfo } from '@/lib/info';
import { Play, Grid, List as ListIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button, Image } from '@nextui-org/react';
import { ProviderData } from '@/app/api/episodes/[id]/route';

interface Props {
  animeData: ProviderData[];
  id: string;
  info: AnilistInfo;
}

const AnimeViewer: React.FC<Props> = ({ animeData, info, id }) => {
  const [selectedProvider, setSelectedProvider] = useState<
    ProviderData | undefined
  >(animeData.find((p) => p.providerId === 'hianime') || animeData[0]);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  const [episodePage, setEpisodePage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const savedLayout = localStorage.getItem('layout');
    if (savedLayout === 'list' || savedLayout === 'grid') {
      setLayout(savedLayout);
    }
  }, []);

  const saveLayoutToLocalStorage = (layout: 'list' | 'grid') => {
    localStorage.setItem('layout', layout);
  };

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
    return (episodes as Episode[])?.[language as 'sub' | 'dub'].filter(
      (episode) =>
        (episode.title ?? `Episode ${episode.number}`)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        String(episode.number).includes(searchQuery)
    );
  }, [searchQuery, episodes]);

  const episodeChunks = useMemo(
    () => _.chunk(filteredEpisodes, 100),
    [filteredEpisodes]
  );
  const currentEpisodes = episodeChunks[episodePage] || [];

  return (
    <div className='p-4' id='watch'>
      {currentEpisodes.length > 0 ? (
        <>
          <div className='mb-4 flex gap-3'>
            <Select onValueChange={handleProviderChange}>
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
                      key={provider.providerId}
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
            {
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
            }
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
            <div className='max-w-44'>
              <Input
                type='text'
                placeholder='Search episodes...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={() => {
                        setLayout('grid');
                        saveLayoutToLocalStorage('grid');
                      }}
                      variant={'light'}
                      isIconOnly
                    >
                      <Grid />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid Layout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={() => {
                        setLayout('list');
                        saveLayoutToLocalStorage('list');
                      }}
                      variant={'light'}
                      isIconOnly
                    >
                      <ListIcon />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List Layout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className='mt-20'>
            <ScrollArea className='h-[600px]'>
              {layout === 'list' ? (
                currentEpisodes.map((episode) => (
                  <EpisodeCard
                    info={info}
                    key={episode.id || episode.episodeId}
                    episode={episode}
                    provider={selectedProvider?.providerId!}
                    id={id}
                    type={language}
                  />
                ))
              ) : (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                  {currentEpisodes.map((episode) => (
                    <GridEpisodeCard
                      info={info}
                      key={episode.id || episode.episodeId}
                      episode={episode}
                      provider={selectedProvider?.providerId!}
                      id={id}
                      type={language}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </>
      ) : (
        <>
          <h1 className='text-3xl font-bold'>No episodes available</h1>
        </>
      )}
    </div>
  );
};

interface EpisodeCardProps {
  episode: Episode;
  provider: string;
  type: 'sub' | 'dub';
  id: string;
  info: AnilistInfo;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  provider,
  type,
  id,
  info,
}) => {
  const episodeId = episode.id || episode.episodeId;
  return (
    <a
      href={`/watch/${id}?episodeId=${encodeURIComponent(episodeId!)}&provider=${provider}&type=${type}&number=${episode.number}`}
      className='mb-4 flex flex-col rounded border p-4 duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/55 md:flex-row lg:flex-row xl:flex-row 2xl:flex-row'
    >
      <Image
        src={
          episode.thumbnail
            ? episode.thumbnail!
            : info.bannerImage
              ? info.bannerImage!
              : info.coverImage!
        }
        alt={episode.title ? episode.title : `Episode ${episode.number}`}
        className='mr-6 h-full w-full object-cover md:max-h-[165px] md:min-h-[165px] md:min-w-[295px] md:max-w-[295px] lg:max-h-[165px] lg:min-h-[165px] lg:min-w-[295px] lg:max-w-[295px]'
      />
      <div className='flex flex-col justify-center'>
        <h2 className='text-xl font-bold'>
          {episode.number} -{' '}
          {episode.title ? episode.title : `Episode ${episode.number}`}
        </h2>
        <p className='line-clamp-5'>
          {episode.description
            ? episode.description
            : `Episode ${episode.number} of ${info.title.english ?? info.title.userPreferred ?? info.title.romaji ?? info.title.native}`}
        </p>
      </div>
    </a>
  );
};

const GridEpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  provider,
  type,
  id,
  info,
}) => {
  const episodeId = episode.id || episode.episodeId;

  return (
    <a
      href={`/watch/${id}?episodeId=${encodeURIComponent(episodeId!)}&provider=${provider}&type=${type}&number=${episode.number}`}
      className='relative flex flex-col rounded p-4'
    >
      <motion.div
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0.5 }}
        className='relative mb-4 h-40 w-full overflow-hidden rounded-xl'
      >
        <Image
          src={
            episode.img
              ? episode.img!
              : info.bannerImage
                ? info.bannerImage!
                : info.coverImage!
          }
          alt={episode.title ? episode.title : `Episode ${episode.number}`}
          width={1600}
          height={1600}
          className='h-full w-full object-cover'
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className='absolute inset-0 z-50 flex items-center justify-center'
        >
          <Button isIconOnly variant={'ghost'}>
            <Play className='h-12 w-12 fill-white text-white' />
          </Button>
        </motion.div>
      </motion.div>
      <div className='flex flex-col justify-center'>
        <h2 className='text-xl font-bold'>{`Episode ${episode.number}`}</h2>
        <p className='line-clamp-2 text-gray-700 dark:text-slate-300'>
          {episode.title ? episode.title : `Episode ${episode.number}`}
        </p>
      </div>
    </a>
  );
};

export default AnimeViewer;
