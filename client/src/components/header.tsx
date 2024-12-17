"use client";
import { AppProviderContext } from "@/components/app-provider";
import { IconSearch } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { useContext } from "react";
import { useLogout } from "@/queries/useAccount";
import { removeTokensFromLocalStorage } from "@/lib/utils";
import IconUser from "@/components/icons/icon-user";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, setUser } = useContext(AppProviderContext);
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    await logoutMutation.mutateAsync(
      { refresh_token },
      {
        onSuccess: (data) => {
          setUser(undefined);
          removeTokensFromLocalStorage();
          router.push("/");
        },
      }
    );
  };

  return (
    <div className="py-3 sticky top-0 left-0 flex items-center gap-5 justify-between bg-white z-10">
      <div className="sm:hidden">
        <Link href="/">
          <span className="text-3xl font-bold text-primary">U</span>
          <span className="text-2xl font-bold">zidemy</span>
        </Link>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage src={"https://github.com/shadcn.png"} alt="User Avatar" />
                <AvatarFallback>{user.fullname.slice(0, 3)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.fullname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )}
      </div>
    </div>
  );
}
