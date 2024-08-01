import { IconSearch } from "@/components/icons";
import Sidebar from "@/components/layout/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-5">
        <Sidebar />
        <div className="px-10">
          <div className="py-3 sticky top-0 left-0 flex items-center gap-5 justify-between mb-10">
            <div className="w-[min(100%,390px)] textGray h-10 rounded-full border borderGray px-5 flex items-center">
              <input type="text" placeholder="Search..." className="flex-grow" />
              <button>
                <IconSearch />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                  <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
