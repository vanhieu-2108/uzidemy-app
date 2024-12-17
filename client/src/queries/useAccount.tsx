import authApiRequest from "@/apiRequests/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useLogout = () => {
  return useMutation({
    mutationFn: (body: any) => authApiRequest.logout(body),
  });
};

export const useUpdateMe = () => {
  return useMutation({
    mutationFn: authApiRequest.updateMe,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApiRequest.changePassword,
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: authApiRequest.getUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => authApiRequest.getUserById(id),
  });
};

export const useUpdateUserById = () => {
  return useMutation({
    mutationFn: (data: any) => authApiRequest.updateUserById(data),
  });
};

export const useDeleteUserById = () => {
  return useMutation({
    mutationFn: authApiRequest.deleteUserById,
  });
};
