import { use } from 'react';
import { getAuthSession } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Image } from '@nextui-org/react';
import { getRelativeTime } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { getAnilistUser } from '@/lib/authenticated';

const SideBar = dynamic(() => import('@/components/sidebar'), { ssr: false });

export default function Profile() {
  const profile = use(getAuthSession());

  if (!profile || !profile.user) redirect('/');

  console.log(profile);
  const actualProfile = use(
    getAnilistUser((profile.user as any).token, profile.user.name!)
  );

  const user = actualProfile?.data?.User;
  const profilePicture = user?.avatar?.large || user?.avatar?.medium || null;

  return (
    <>
      <div className='bg-background absolute top-0 h-screen w-[50px]'>
        <SideBar />
      </div>

      <div className='bg-background text-foreground min-h-screen overflow-x-hidden'>
        {user?.bannerImage ? (
          <Image
            radius='none'
            className='h-56 min-w-[1920px] object-cover sm:h-72 md:h-96'
            src={user?.bannerImage}
            draggable={false}
            alt={`Banner image ${user?.name}`}
          />
        ) : (
          <>
            <div className='h-56 w-full bg-[#00FF7F] object-cover sm:h-72 md:h-96' />
          </>
        )}
        <div className='relative z-10 flex flex-col items-center p-6'>
          {profilePicture && (
            <img
              src={profilePicture}
              alt={`Profile picture of ${user?.name}`}
              className='-mt-16 h-32 w-32 rounded-full border-4 border-white sm:h-40 sm:w-40 md:h-48 md:w-48 dark:border-gray-900'
            />
          )}
          <h1 className='mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl'>
            {user?.name}
          </h1>
          <p className='mt-2 text-sm text-gray-600 sm:text-base md:text-lg dark:text-gray-400'>
            Joined {getRelativeTime(user?.createdAt!)}
          </p>
        </div>
      </div>
    </>
  );
}
