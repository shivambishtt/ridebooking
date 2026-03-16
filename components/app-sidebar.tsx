"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent
} from "@/components/ui/sidebar"

export function AppSidebar({ setMenuOpen }: { setMenuOpen: (v: boolean) => void }) {
  return (
    <Sidebar>

      <SidebarHeader className="px-4 py-3 font-semibold text-lg">
        RideBook 🚕
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-1">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              Home
            </Link>

            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              Account
            </Link>

            <Link
              href="/rides"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-muted text-sm"
            >
              Rides
            </Link>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 text-xs text-muted-foreground">
        © RideBook
      </SidebarFooter>

    </Sidebar>
  )
}