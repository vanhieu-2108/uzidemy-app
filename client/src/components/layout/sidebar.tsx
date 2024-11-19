"use client";
import { useAppProvider } from "@/components/app-provider";
import { menuItems } from "@/constants/menuItems";
import { cn, getAccessTokenFromLocalStorage, isAdmin } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const path = usePathname();
  const { user } = useAppProvider();
  const token = getAccessTokenFromLocalStorage();
  const checkAdmin = token ? Boolean(isAdmin(token)) : false;
  return (
    <>
      <div className="p-5 border borderGray h-screen hidden lg:block sticky top-0 left-0">
        <Link href="/">
          <span className="text-3xl font-bold text-primary">U</span>
          <span className="text-2xl font-bold">zidemy</span>
        </Link>
        <ul className="mt-5 flex flex-col gap-4">
          {menuItems.map((item) => {
            if ((item.isPublic === false && !Boolean(user)) || (item.isAdmin === true && !checkAdmin)) return null;
            return (
              <li key={item.title}>
                <Link
                  className={cn(
                    "py-3 px-2 flex items-center gap-4 transition-all rounded-md font-medium hover:text-primary",
                    path === item.url
                      ? "bg-primary/20 svg-animate pointer-events-none text-primary"
                      : "hover:bg-primary/20 textGray"
                  )}
                  href={item.url}
                >
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lg:hidden z-10">
        <ul className="flex gap-4 fixed bottom-0 left-0 w-full justify-center bg-white">
          {menuItems.map((item) => {
            if (item.isPublic === false && !Boolean(user)) return null;
            return (
              <li key={item.title}>
                <Link
                  className={cn(
                    "p-4 flex items-center gap-4 transition-all rounded-md font-medium hover:text-primary",
                    path === item.url
                      ? "bg-primary/20 svg-animate pointer-events-none text-primary"
                      : "hover:bg-primary/20 textGray"
                  )}
                  href={item.url}
                >
                  {item.icon}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
