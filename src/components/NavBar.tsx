'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  Avatar,
} from '@nextui-org/react';
import { ConsumetSearchResult } from '@/types/consumet';
import useDebounce from '@/hooks/use-debounce';
import Image from 'next/image';
import { AnilistUserResponse, getAnilistUser } from '@/lib/authenticated';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function NavBar({ session }: { session: Session | null }) {
  const [searchResults, setSearchResults] =
    useState<ConsumetSearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [user, setUser] = useState<AnilistUserResponse | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 1000);

  useEffect(() => {
    async function getUser() {
      if (session && session.user) {
        try {
          const userData = await getAnilistUser(
            (session as any).user.token,
            session?.user?.name!
          );
          if (userData?.data) {
            setUser(userData.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }

    getUser();
  }, [session]);

  useEffect(() => {
    async function search(
      query: string
    ): Promise<ConsumetSearchResult | undefined> {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN!}/api/search/${query}`,
          { headers: { 'x-site': 'elyzen' } }
        );
        return (await response.json()) as ConsumetSearchResult;
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }

    const fetchSearchResults = async (query: string) => {
      if (query.trim() !== '') {
        const result = await search(query);
        setSearchResults(result as ConsumetSearchResult);
      } else {
        setSearchResults(null);
      }
    };

    fetchSearchResults(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link href='/'>
          <h1 className='text-4xl font-extrabold'>
            Ely<span className='text-green-500'>Zen</span>
          </h1>
        </Link>
      </NavbarBrand>

      <NavbarContent justify='end'>
        <Dialog>
          <DialogTrigger>
            <SearchIcon className='size-5 md:size-8 lg:size-8' />
          </DialogTrigger>
          <DialogContent>
            <DialogDescription>
              <h1 className='text-2xl font-bold'>Search By Name</h1>
              <Input
                className='max-w-[200px]'
                onChange={handleSearchInputChange}
                placeholder='Naruto'
              />
              <div className='mt-10'>
                {searchResults && !('message' in searchResults) && (
                  <div className='scrollbar-hide max-h-[250px] overflow-y-scroll'>
                    {searchResults.results
                      .filter(
                        (s) =>
                          s.status !== 'Not yet aired' &&
                          s.status !== 'NOT_YET_RELEASED' &&
                          s.rating
                      )
                      .map((result) => (
                        <Link key={result.id} href={`/info/${result.id}`}>
                          <div className='hover:bg-base-200 mb-2 flex cursor-pointer items-center gap-2 duration-200'>
                            <Image
                              src={result.image}
                              alt={result.title.romaji}
                              width={1000}
                              height={1000}
                              className='max-h-[200px] max-w-[100px] object-cover'
                            />
                            <div>
                              <p style={{ color: result.color ?? 'crimson' }}>
                                {result.title.english
                                  ? result.title.english
                                  : result.title.romaji}
                              </p>
                              <p>Rating: {result.rating / 10 ?? 0.0}</p>
                              <p>
                                Total Episodes:{' '}
                                {result.currentEpisode ?? result.totalEpisodes}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    <p className='text-red-400'>
                      Some content has been filtered out. Use the catalog page
                      to get all.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar
              isBordered
              as='button'
              className='transition-transform'
              color='secondary'
              name={user?.User?.name || 'Guest'}
              size='sm'
              src={
                user?.User?.avatar?.large ||
                user?.User?.avatar?.medium ||
                'https://i.pinimg.com/736x/40/0c/e7/400ce7d399fb081bdb226b9b740c9983.jpg'
              }
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent aria-label='Profile Actions'>
            {session && session.user ? (
              <>
                <DropdownMenuItem key='profile'>
                  <Link href='/profile'>Profile</Link>
                </DropdownMenuItem>

                <DropdownMenuItem key='settings'>
                  <Link href='/settings'>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  key='logout'
                  color='danger'
                  onClick={() => signOut()}
                >
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem key='login' onClick={() => signIn()}>
                  Login
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </NavbarContent>
    </Navbar>
  );
}
