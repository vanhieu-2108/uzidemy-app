"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import banner from "../../../../public/img1.avif";
import { useRegister } from "@/queries/useAccount";
import { EntityError } from "@/lib/http";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    fullname: z.string().min(6, "Tên phải có ít nhất 6 ký tự").max(50, "Tên không được quá 50 ký tự"),
  })
  .strict()
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Nhập lại mật khẩu không khớp",
        path: ["confirm_password"],
      });
    }
  });
type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      fullname: "",
    },
  });

  const useRegisterMutation = useRegister();
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    useRegisterMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(data.payload.message);
        router.push("/login");
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
          <span className="mp-3 text-4xl font-bold text-black">Đăng Ký</span>
          <span className="font-light text-gray-400 mb-8">Nếu bạn chưa có tài khoản vui lòng đăng ký</span>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (error) => {
                console.log(error);
              })}
              className="space-y-4 mb-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Email</FormLabel>
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
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your fullname..."
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
                    <FormLabel className="text-black">Mật khẩu</FormLabel>
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Nhập lại mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your confirm password..."
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
                className="w-full bg-black text-white p-2 rounded-lg mb-6  hover:text-black hover:border hover:bg-gray-300"
              >
                Đăng Ký
              </Button>
            </form>
          </Form>

          <div className="text-center text-gray-400">
            Bạn đã có tài khoản?
            <Link href="/login" className="ml-2 text-black font-bold">
              Đăng nhập
            </Link>
          </div>
        </div>
        <div className="relative">
          <Image src={banner} alt="img" className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover" />
        </div>
      </div>
    </div>
  );
}
