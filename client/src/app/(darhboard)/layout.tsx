import { IconSearch, IconUser } from "@/components/icons";
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
import Link from "next/link";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-5 px-5 lg:pl-0">
        <Sidebar />
        <div>
          <div className="py-3 sticky top-0 left-0 flex items-center gap-5 justify-between mb-10">
            <div className="hidden sm:flex w-[min(100%,390px)] textGray h-10 rounded-full border borderGray px-4 items-center">
              <input type="text" placeholder="Search..." className="flex-grow pr-4" />
              <button className="flex-shrink-0">
                <IconSearch />
              </button>
            </div>
            <div className="sm:hidden">
              <Link href="/">
                <span className="text-3xl font-bold text-primary">U</span>
                <span className="text-2xl font-bold">zidemy</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              {/* <DropdownMenu>
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
              </DropdownMenu> */}
              <div>
                <Link
                  href="/login"
                  className="px-6 gap-2 text-nowrap items-center flex py-2 text-primary dark:textGray bg-primary/30 font-medium rounded-full"
                >
                  <div className="hidden md:block">
                    <IconUser />
                  </div>
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
