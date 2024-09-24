import http from "@/lib/http";
import { ResponseRegister } from "@/ResponseType/auth.type";
import { ResponseLogin } from "@/types/auth";
import { Response } from "@/types/res";

const authApiRequest = {
  login: (body: any) =>
    http.post<Response<ResponseLogin>>("/api/auth/login", body, {
      baseURL: "",
    }),
  sLogin: (body: any) => http.post<Response<ResponseLogin>>("/users/login", body),
  register: (body: any) => http.post<ResponseRegister>("/users/register", body),
};

export default authApiRequest;
