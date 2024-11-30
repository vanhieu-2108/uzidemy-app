"use client";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { checkAndRefreshToken } from "@/utils/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  useEffect(() => {
    if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [redirectPathname, refreshTokenFromUrl, router]);
  return <div>Refresh Token ...</div>;
}

export default function RefreshTokenPage() {
  <Suspense>
    <Page />
  </Suspense>;
}
