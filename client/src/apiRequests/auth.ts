import http from "@/lib/http";
import { ResponseRegister } from "@/ResponseType/auth.type";

const authApiRequest = {
  login: (body: any) =>
    http.post("/api/auth/login", body, {
      baseURL: "",
    }),
  sLogin: (body: any) => http.post("/users/login", body),
  register: (body: any) => http.post<ResponseRegister>("/users/register", body),
};

export default authApiRequest;
