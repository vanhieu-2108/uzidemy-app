import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { ROLE } from "@/constants/enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem("access_token") : null);

export const getRefreshTokenFromLocalStorage = () => (isBrowser ? localStorage.getItem("refresh_token") : null);

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isBrowser && localStorage.setItem("access_token", accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isBrowser && localStorage.setItem("refresh_token", refreshToken);

export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("access_token");
  isBrowser && localStorage.removeItem("refresh_token");
};

export const isAdmin = (token: string) => {
  const payload = (jwt.decode(token) as { role: string }) || false;
  return payload.role === ROLE.ADMIN;
};

export const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};
