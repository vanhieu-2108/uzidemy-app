import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccessTokenFromLocalStorage = () => localStorage.getItem("access_token") || "";
export const setAccessTokenToLocalStorage = (accessToken: string) => localStorage.setItem("access_token", accessToken);

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem("refresh_token") || "";
export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  localStorage.setItem("refresh_token", refreshToken);

export const removeTokensFromLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
