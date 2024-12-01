"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
const VerificationSchema = z.object({
  code: z.string().length(6, "Mã xác nhận phải có 6 ký tự"),
});

export default function VerificationForm() {
  // Khởi tạo useForm với resolver từ Zod schema
  const form = useForm({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      code: Array(6).fill(""), // Khởi tạo mã với 6 ô trống
    },
  });

  // Hàm xử lý khi submit form
  const onSubmit = (values: any) => {
    console.log(values.code.join("")); // Chuyển mã xác nhận thành chuỗi
    // Gọi API xác thực mã ở đây
  };

  // Hàm để xử lý input
  const handleChange = (index: number, value: string) => {
    const codeArray = [...form.getValues("code")];
    codeArray[index] = value;

    // Chuyển đến ô tiếp theo nếu có giá trị
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }
    form.setValue("code", codeArray);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center items-center p-8 md:p-14">
          <span className="mp-3 text-4xl font-bold text-black">
            Nhập mã xác nhận
          </span>
          <span className="font-light text-gray-400 mt-2 mb">
            Vui lòng nhập mã xác nhận đã gửi đến email của bạn
          </span>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác nhận</FormLabel>
                    <div className="flex space-x-2">
                      {[...Array(6)].map((_, index) => (
                        <Controller
                          key={index}
                          name={`code.${index}`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id={`code-input-${index}`}
                              maxLength={1}
                              className="w-12 h-12 text-center border border-gray-300 rounded-md text-black"
                              onChange={(e) => {
                                handleChange(index, e.target.value);
                                field.onChange(e); // Cập nhật giá trị cho ô hiện tại
                              }}
                              placeholder="•"
                            />
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 text-white text-base pt-5 pb-5 pr-32 pl-32"
              >
                <Link href="/forgot-password?step=reset-password">
                  Xác nhận
                </Link>
              </Button>
            </form>
          </Form>

          <div className="text-center text-gray-400 mt-4">
            Bạn không nhận được mã?
            <Link href="#" className="ml-2 text-black font-bold">
              Gửi lại mã
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
