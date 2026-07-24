'use client';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './ui/tooltip';
import { ModeToggle } from './theme-toggle';
import useDeviceDetector from '@/hooks/use-device-detector';
import { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { FaHome, FaFire, FaRegStar, FaGithub } from 'react-icons/fa';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';
import { FiMenu } from 'react-icons/fi';
import { IoSettings } from 'react-icons/io5';
import { Button } from '@nextui-org/react';
import { FaDiscord } from 'react-icons/fa';

export default function SideBar() {
  const device = useDeviceDetector();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(device === 'mobile');
  }, [device]);

  return (
    <>
      {!isMobile ? (
        <div className='fixed z-[999999] flex h-full flex-col items-center justify-center gap-2 px-1 pt-10'>
          <div className='m-auto'>
            <div className='flex flex-col gap-2'>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='/'>
                        <Button variant={'light'} isIconOnly radius='full'>
                          <FaHome size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ModeToggle />
                    </div>
                  </TooltipTrigger>
                  <Separator className='my-2' />
                  <TooltipContent side='right'>
                    <p>Theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='flex flex-col gap-2'>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='/catalog?sort=TRENDING_DESC&type=ANIME'>
                        <Button variant={'light'} isIconOnly radius='full'>
                          <FaFire size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Trending</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='/catalog?sort=POPULARITY_DESC&sort=SCORE_DESC&type=ANIME'>
                        <Button variant={'light'} isIconOnly radius='full'>
                          <FaRegStar size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Popular</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='/catalog'>
                        <Button variant={'light'} isIconOnly radius='full'>
                          <BsFillJournalBookmarkFill size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Catalog</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Separator className='my-2' />
            <div className='mb-2 flex flex-col gap-2'>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='/settings'>
                        <Button variant={'light'} isIconOnly radius='full'>
                          <IoSettings size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className='self-end'>
            <div className='flex flex-col gap-1'>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='https://discord.gg/a4RCC2jCEt'>
                        <Button isIconOnly radius='full' variant='light'>
                          <FaDiscord size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>Discord</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div>
                      <Link href='https://github.com/codeblitz97/elyzen'>
                        <Button isIconOnly radius='full' variant='light'>
                          <FaGithub size={25} />
                        </Button>
                      </Link>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={'right'}>
                    <p>GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      ) : (
        <div className='fixed top-12 left-2 z-[999999]'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant={'light'} isIconOnly radius='full'>
                <FiMenu size={25} />
              </Button>
            </DrawerTrigger>
            <DrawerContent className='sticky z-[388484]'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-1'>
                  <Link href='/'>
                    <Button variant={'light'} isIconOnly radius='full'>
                      <FaHome size={25} />
                    </Button>
                  </Link>{' '}
                  <span className='font-bold'>Home</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span>
                    <ModeToggle />
                  </span>{' '}
                  <span className='font-bold'>Change Theme</span>
                </div>
                <Separator className='my-2' />
                <Link href='/catalog?sort=TRENDING_DESC&type=ANIME'>
                  <div className='flex items-center gap-1'>
                    <span>
                      <Button variant={'light'} isIconOnly radius='full'>
                        <FaFire size={25} />
                      </Button>
                    </span>
                    <span className='font-bold'>Trending</span>
                  </div>
                </Link>
                <Link href='/catalog?sort=POPULARITY_DESC&sort=SCORE_DESC&type=ANIME'>
                  <div className='flex items-center gap-1'>
                    <span>
                      <Button variant={'light'} isIconOnly radius='full'>
                        <FaRegStar size={25} />
                      </Button>
                    </span>
                    <span className='font-bold'>Popular</span>
                  </div>
                </Link>
                <Link href='/catalog'>
                  <div className='flex items-center gap-1'>
                    <span>
                      <Button variant={'light'} isIconOnly radius='full'>
                        <BsFillJournalBookmarkFill size={25} />
                      </Button>
                    </span>
                    <span className='font-bold'>Catalog</span>
                  </div>
                </Link>
                <Separator className='my-2' />
                <div className='flex items-center gap-1'>
                  <span>
                    <Button variant={'light'} isIconOnly radius='full'>
                      <IoSettings size={25} />
                    </Button>
                  </span>
                  <span className='font-bold'>Settings</span>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  );
}
