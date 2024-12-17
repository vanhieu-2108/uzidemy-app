import { ROLE } from "@/constants/enum";

export enum EStatusUser {
  ACTIVE = "ACTIVE",
  DEACTIVE = "DEACTIVE",
}

export interface Account {
  _id: string;
  email: string;
  fullname: string;
  role: ROLE;
  avatar: string;
  created_at: string;
  updated_at: string;
  verify: number;
  status: EStatusUser;
}

export interface ResponseLogin {
  access_token: string;
  refresh_token: string;
  account: Account;
}

export interface ResponseLogout {
  message: string;
}
