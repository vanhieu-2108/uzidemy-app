"use client";
import { menuItems } from "@/constants/menuItems";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const path = usePathname();
  return (
    <div className="p-5 border borderGray h-screen hidden lg:block sticky top-0 left-0">
      <Link href="/">
        <span className="text-3xl font-bold text-primary">U</span>
        <span className="text-2xl font-bold">zidemy</span>
      </Link>
      <ul className="mt-5 flex flex-col gap-4">
        {menuItems.map((item) => (
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
        ))}
      </ul>
    </div>
  );
}
