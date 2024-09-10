"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import banner from "../../../../public/img1.avif";

// Schema validation với Zod
const EmailFormSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

export default function EmailForm() {
  // Khởi tạo useForm với resolver từ Zod schema
  const form = useForm({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Hàm xử lý khi submit form
  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14 items-center">
          <span className="mp-3 mb-5 text-4xl font-bold text-black ">
            Quên mật khẩu
          </span>
          <span className="font-light text-gray-400 mt-5 mb">
            Vui lòng nhập email bạn đã đăng ký
          </span>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {/* <p className="text-black">Email</p> */}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        // placeholder="Enter your email..."
                        className="w-full p-2 border border-gray-300 rounded-md text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 pl-28 text-lg text-white pt-5 pb-5 pr-28"
              >
                <a href="/forgot-password?step=verification">Gửi mã xác</a>
              </Button>
            </form>
          </Form>

          <div className="text-center text-gray-400 mt-4">
            Bạn chưa có tài khoản?
            <Link href="/register" className="ml-2 text-black font-bold">
              Đăng ký
            </Link>
          </div>
        </div>
        <div className="relative ">
          <Image
            src={banner}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover "
          />
        </div>
      </div>
    </div>
  );
}
