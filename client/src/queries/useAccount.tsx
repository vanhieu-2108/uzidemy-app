import authApiRequest from "@/apiRequests/auth";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationFn: (body: any) => authApiRequest.register(body),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (body: any) => authApiRequest.login(body),
  });
};
