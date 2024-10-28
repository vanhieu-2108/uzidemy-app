import { Response } from "@/types/res";

export interface ResponseRegister {
  message: string;
}

export interface RefreshTokenBodyType {
  refresh_token: string;
}

export type RefreshTokenResType = Response<{
  access_token: string;
  refresh_token: string;
}>;
