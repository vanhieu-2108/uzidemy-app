"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import banner from "../../../public/img1.avif";
import { useLogin } from "@/queries/useAccount";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { AppProviderContext } from "@/components/app-provider";
import { EntityError } from "@/lib/http";

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { setUser } = useContext(AppProviderContext);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  async function onSubmit(values: FormData) {
    loginMutation.mutateAsync(values, {
      onSuccess: (data) => {
        const { access_token, refresh_token, account } = data.payload.result;
        localStorage.setItem("user", JSON.stringify(account));
        setUser(account);
        setAccessTokenToLocalStorage(access_token);
        setRefreshTokenToLocalStorage(refresh_token);
        toast.success("Đăng nhập thành công");
        router.push("/");
      },
      onError: (error) => {
        if (error instanceof EntityError) {
          const errors = error.payload.errors;
          for (const key in errors) {
            form.setError(key as keyof FormData, {
              type: "server",
              message: errors[key].msg,
            });
          }
          return;
        }
        toast.error(error.message);
        throw error;
      },
    });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mp-3 text-4xl font-bold text-black">Đăng Nhập</span>
          <span className="font-light text-gray-400 mb-8">Vui lòng đăng nhập vào tài khoản của bạn</span>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email..."
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password..."
                        {...field}
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:bg-gray-300"
              >
                Đăng Nhập
              </Button>
            </form>
          </Form>

          <div className="text-center text-gray-400">
            Bạn chưa có tài khoản?
            <Link href="/register" className="ml-2 text-black font-bold">
              Đăng ký
            </Link>
          </div>
        </div>
        <div className="relative ">
          <Image src={banner} alt="img" className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover " />
        </div>
      </div>
    </div>
  );
}
