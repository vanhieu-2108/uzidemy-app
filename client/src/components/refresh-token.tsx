"use clent";
import { checkAndRefreshToken } from "@/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// Những page sau sẽ không check refresh token
const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
    let interval: any = null;
    // Phải gọi lân đầu tiên, vì interval chỉ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn của access token là 10s thì 1s mình sẽ kiểm tra 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname, router]);
  return null;
}
