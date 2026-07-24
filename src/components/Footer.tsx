'use client';
import Link from 'next/link';
import { GithubIcon } from 'lucide-react';

function Footer() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();

  function getSeason(month: number) {
    if (month === 12 || month === 1 || month === 2) {
      return 'WINTER';
    } else if (month === 3 || month === 4 || month === 5) {
      return 'SPRING';
    } else if (month === 6 || month === 7 || month === 8) {
      return 'SUMMER';
    } else {
      return 'FALL';
    }
  }

  const format = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

  function nextSeason(currentSeason: any) {
    const currentSeasonIndex = format.indexOf(currentSeason);
    const nextSeasonIndex = (currentSeasonIndex + 1) % format.length;
    return format[nextSeasonIndex];
  }

  return (
    <div>
      <footer className='mt-10 bg-background'>
        <div className='mx-auto w-full p-4 py-6 lg:max-w-[85%] lg:pb-3 lg:pt-8'>
          <div className='lg:flex lg:justify-between'>
            <div className='mb-6 lg:mb-0'>
              <Link href='/' className='flex w-fit items-center'>
                <p className='self-center whitespace-nowrap text-3xl font-medium'>
                  Elyzen
                </p>
              </Link>
              <p className='font-karla text-[0.7rem] lg:w-[520px] lg:text-[0.8rem]'>
                This site does not store any files on our server, we are linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-2 sm:gap-6 lg:gap-16'>
              <div>
                <ul className='flex flex-col gap-2 text-[0.7rem] font-semibold lg:text-[0.85rem]'>
                  <li className=''>
                    <Link
                      href={`/anime/catalog?season=${getSeason(month + 1)}&year=2024`}
                    >
                      This Season
                    </Link>
                  </li>
                  <li className=''>
                    <Link
                      href={`/catalog?season=${nextSeason(getSeason(month + 1))}&year=2024`}
                    >
                      Upcoming Season
                    </Link>
                  </li>
                  <li>
                    <Link href='/catalog?format=MOVIE'> Movies</Link>
                  </li>
                  <li>
                    <Link href='/catalog?format=TV'> Tv Shows</Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className='flex flex-col gap-2 text-[0.7rem] font-semibold lg:text-[0.85rem]'>
                  <li>
                    <Link href='/dmca'> DMCA</Link>
                  </li>
                  <li>
                    <Link
                      href='/privacy'
                      className='!text-[0.8rem] !font-semibold'
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/terms'
                      className='!text-[0.8rem] !font-semibold'
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-2 border-t border-white/5'></div>
        <div className='mx-auto w-full py-3 text-[0.7rem] lg:flex lg:max-w-[83%] lg:items-center lg:justify-between lg:text-[0.8rem]'>
          <span className='ms-5 sm:text-center lg:ms-0'>
            © {year}{' '}
            <Link href='/' className='hover:text-white'>
              Elyzen
            </Link>{' '}
            | Made by{' '}
            <Link href='https://www.sohom829.xyz/' target='_blank'>
              <span className='font-bold'>codeblitz97</span>
            </Link>
          </span>
          <div className='mt-4 flex lg:mt-0 lg:justify-center'>
            <Link
              href='https://github.com/codeblitz97/elyzen'
              target='_blank'
              className='ms-5 hover:text-gray-900 dark:hover:text-white lg:ms-0'
            >
              <GithubIcon />
              <span className='sr-only'>GitHub</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
