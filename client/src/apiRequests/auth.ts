import http from "@/lib/http";
import { RefreshTokenBodyType, RefreshTokenResType, ResponseRegister } from "@/ResponseType/auth.type";
import { Account, ResponseLogin, ResponseLogout } from "@/types/auth";
import { Response } from "@/types/res";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  login: (body: any) =>
    http.post<Response<ResponseLogin>>("/api/auth/login", body, {
      baseURL: "",
    }),
  sLogin: (body: any) => http.post<Response<ResponseLogin>>("/users/login", body),
  register: (body: any) => http.post<ResponseRegister>("/users/register", body),
  sLogout: (body: { refresh_token: string }) => http.post<Response<ResponseLogout>>("/users/logout", body),
  logout: (body: { refresh_token: string }) =>
    http.post<Response<ResponseLogout>>("/api/auth/logout", body, { baseURL: "" }),
  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>("/users/refresh-token", body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
      baseURL: "",
    });
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  updateMe: (body: any) => http.put<Response<Account>>("/users/update-me", body),
  changePassword: (body: any) => http.put<Response<Account>>("/users/change-password", body),
  getUsers: () => http.get<Response<Account[]>>("/users"),
  getUserById: (id: string) => http.get<Response<Account>>(`/users/${id}`),
  updateUserById: ({ id, body }: { id: string; body: any }) => http.put<Response<Account>>(`/users/${id}`, body),
  deleteUserById: (id: string) => http.delete<Response<Account>>(`/users/${id}`),
};

export default authApiRequest;
