'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  useSidebar,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  Bookmark,
  Clock,
  Compass,
  Heart,
  Home,
  History,
  LucideIcon,
  Search,
  Settings,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { AvatarDropdown } from './avatar-dropdown';

type SidebarItem = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const ITEMS: SidebarItem[] = [
  {
    name: 'Home',
    icon: Home,
    path: '/',
  },
  {
    name: 'Discover',
    icon: Compass,
    path: '/discover',
  },
  {
    name: 'Search',
    icon: Search,
    path: '/search',
  },
];

const LIB_ITEMS: SidebarItem[] = [
  {
    name: 'Liked',
    icon: Heart,
    path: '/liked',
  },
  {
    name: 'Favorites',
    icon: Bookmark,
    path: '/favorites',
  },
  {
    name: 'Watch Later',
    icon: Clock,
    path: '/watch-later',
  },
  {
    name: 'History',
    icon: History,
    path: '/history',
  },
];

export default function AppSidebar() {
  const router = useRouter();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarHeader className='flex-row items-center justify-between'>
          {open && <h1 className='ml-2 text-xl font-semibold'>Elyzen</h1>}
          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarTrigger className='hover:bg-sidebar-accent! p-4' />
              }
              delay={1000}
            />
            <TooltipContent side='right'>
              <span>Toggle Sidebar</span>
              <div className='text-muted-foreground flex items-center gap-1 font-mono text-[10px]'>
                <kbd className='bg-muted/20 pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className='bg-muted/20 pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
                  .
                </kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarMenu className='gap-1'>
            {ITEMS.map((item) => {
              const Icon = item.icon;

              if (open) {
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton onClick={() => router.push(item.path)}>
                      <Icon className='size-4' />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger
                    render={
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => router.push(item.path)}
                        >
                          <Icon className='size-4' />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    }
                  />
                  <TooltipContent side='right'>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='gap-1'>
              {LIB_ITEMS.map((item) => {
                const Icon = item.icon;

                if (open) {
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton onClick={() => router.push(item.path)}>
                        <Icon className='size-4' />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger
                      render={
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={() => router.push(item.path)}
                          >
                            <Icon className='size-4' />
                            <span>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      }
                    />
                    <TooltipContent side='right'>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className='gap-1'>
          {open ? (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/settings')}>
                <Settings className='size-4' />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push('/settings')}>
                      <Settings className='size-4' />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                }
              />
              <TooltipContent side='right'>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          )}

          <SidebarMenuItem>
            <AvatarDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
