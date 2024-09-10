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
const formSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirm_password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
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

export default function ResetPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Gọi API để đặt lại mật khẩu ở đây
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mp-3 text-4xl font-bold text-black justify-center text-center">
            Đặt lại mật khẩu
          </span>
          <span className="font-light text-gray-400 mb-8">
            Vui lòng nhập mật khẩu mới và xác nhận mật khẩu
          </span>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mb-5"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới..."
                        {...field}
                        className="text-black w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
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
                    <FormLabel className="text-black">
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu..."
                        {...field}
                        className="w-full text-black p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-base pt-5 pb-5 text-white p-2 rounded-lg mb-6 shadow hover:bg-primary/90"
              >
                <Link href="/forgot-password?step=success">
                  Đặt lại mật khẩu
                </Link>
              </Button>
            </form>
          </Form>

          <div className="text-center text-gray-400">
            Bạn nhớ mật khẩu?
            <Link href="/login" className="ml-2 text-black font-bold">
              Đăng nhập
            </Link>
          </div>
        </div>
        <div className="relative">
          <Image
            src={banner}
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}
