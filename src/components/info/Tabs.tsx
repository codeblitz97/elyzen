'use client';

import { AnilistInfo, ICharacter } from '@/lib/info';
import { Provider } from '@/types/api';
import AnimeViewer from '../shared/EpisodeList';
import { Card } from '../shared/Card';
import { Tabs as UITabs, Tab, Image, Link } from '@nextui-org/react';
import { SeasonalMedia } from '@/types/anime-data';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import NextLink from 'next/link';

export default function Tabs({
  info,
  episodes,
  id,
  characters,
}: {
  info: AnilistInfo;
  episodes: Provider[];
  id: string;
  characters: ICharacter[];
}) {
  const [hoveredCharacter, setHoveredCharacter] = useState<number | null>(null);

  return (
    <>
      <div className='min-w-full overflow-hidden scrollbar-hide'>
        <UITabs variant={'underlined'} aria-label='Information'>
          <Tab key='episodes' title='Episodes'>
            <AnimeViewer animeData={episodes} info={info} id={id} />
          </Tab>
          <Tab key='relations' title='Relations'>
            <div className='flex gap-2'>
              {info.relations
                ?.filter(
                  (r) => !['ALTERNATIVE', 'ADAPTATION'].includes(r.relationType)
                )
                .map((relation) => (
                  <div key={relation.id} className='max-w-[190px]'>
                    <Card anime={relation as unknown as SeasonalMedia} />
                  </div>
                ))}
            </div>
          </Tab>
          <Tab key='characters' title='Characters'>
            <Carousel
              className='relative ml-10 w-full'
              opts={{ align: 'start' }}
            >
              <CarouselContent>
                {characters.map((character) => (
                  <CarouselItem
                    className='basis-1/2 md:basis-1/3 lg:basis-1/5'
                    key={character.id}
                  >
                    <Link as={NextLink} href={`/character/${character.id}`}>
                      <motion.div
                        onHoverStart={() => setHoveredCharacter(character.id)}
                        onHoverEnd={() => setHoveredCharacter(null)}
                        className='relative h-[200px] w-[150px]'
                      >
                        <AnimatePresence>
                          {hoveredCharacter === character.id &&
                          character.voiceActors.length > 0 ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className='absolute left-0 top-0 h-full w-full'
                            >
                              <Image
                                src={character.voiceActors[0].image.large}
                                alt={character.voiceActors[0].name.full}
                                width={150}
                                height={200}
                                className='object-cover'
                              />
                              <div className='absolute bottom-0 left-0 z-50 w-full bg-black bg-opacity-50 text-center text-white'>
                                {character.voiceActors[0].name.full}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className='absolute left-0 top-0 h-full w-full'
                            >
                              <Image
                                src={character.node.image.large}
                                alt={character.node.name.full}
                                width={150}
                                height={200}
                                className='object-cover'
                              />
                              <div className='absolute bottom-0 left-0 z-50 w-full bg-black bg-opacity-50 text-center text-white'>
                                {character.node.name.full}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='absolute -left-5 md:-left-10' />
              <CarouselNext className='absolute right-10' />
            </Carousel>
          </Tab>
        </UITabs>
      </div>
    </>
  );
}
