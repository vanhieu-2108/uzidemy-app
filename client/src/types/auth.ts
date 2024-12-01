import { ROLE } from "@/constants/enum";
import { Response } from "@/types/res";

export interface Account {
  _id: string;
  email: string;
  fullname: string;
  role: ROLE;
  avatar: string;
  created_at: string;
  updated_at: string;
  verify: number;
}

export interface ResponseLogin {
  access_token: string;
  refresh_token: string;
  account: Account;
}

export interface ResponseLogout {
  message: string;
}
