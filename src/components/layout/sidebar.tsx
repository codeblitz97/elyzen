"use client"

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
} from "@/components/ui/sidebar"
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import { Compass, Home, LucideIcon } from "lucide-react"

import { useRouter } from "next/navigation"

function SidebarTitle() {
  const { state } = useSidebar()

  const collapsed = state === "collapsed"

  return (
    <div className="flex justify-between items-center gap-2 p-0">
      {!collapsed ? (
        <>
          <span className="font-semibold whitespace-nowrap text-xl justify-between px-2">
            Elyzen
          </span>
          <SidebarTrigger className="p-4 hover:bg-sidebar-accent!" />
        </>
      ) : (
        <>
          <span className="block font-semibold whitespace-nowrap text-xl justify-between px-2 sm:hidden">
            Elyzen
          </span>
          <SidebarTrigger className="p-4 hover:bg-sidebar-accent!" />
        </>
      ) }
    </div>
  )
}

type SidebarItem = {
  name: string;
  icon: LucideIcon;
  path: string;
};

const ITEMS: SidebarItem[] = [
  {
    name: "Home",
    icon: Home,
    path: '/'
  },
  {
    name: "Discover",
    icon: Compass,
    path: "/discover"
  }
]

export default function AppSidebar() {
  const router = useRouter();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="overflow-x-hidden">
        <SidebarHeader>
          <SidebarTitle />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {ITEMS.map((item) => {
              const Icon = item.icon;

              if (open) {
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton onClick={() => router.push(item.path)}>
                      <Icon className="size-4" />
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
                        <SidebarMenuButton onClick={() => router.push(item.path)}>
                          <Icon className="size-4" />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    }
                  />
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </SidebarMenu>  
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
                onClick={() => router.push('/settings')}
              >
              <HugeiconsIcon icon={Settings01Icon} className="w-4 h-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <AvatarDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  )
}
