"use client";

import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react";

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton>
            <Avatar className="w-4 h-4 bg-linear-to-br from-emerald-400 via-green-500 to-teal-600 shadow-sm ring-1 ring-black/10 dark:ring-white/10" />
            <span className="whitespace-nowrap">Adolf Hitler</span>
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent className="w-auto">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Avatar className="w-7 h-7 bg-linear-to-br from-emerald-400 via-green-500 to-teal-600 shadow-sm ring-1 ring-black/10 dark:ring-white/10" />
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground">Adolf Hitler</span>
              <span className="text-muted">hitler@nazi.germany</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive" variant="destructive">
            <LogOut className="w-4 h-4 rotate-180" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
