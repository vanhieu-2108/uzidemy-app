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
import banner from '../../../public/img1.avif';
import { useRouter } from "next/navigation";
import { AppProviderContext } from "@/components/app-provider";
import { ToastContainer, toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { setUser } = useContext(AppProviderContext);
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
   
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl mt-10 relative">
    <ToastContainer />
    <button
      type="button"
      className="absolute top-2 right-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
      onClick={form.handleSubmit(onSubmit)}
    >
      Cập nhật
    </button>
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Form Inputs */}
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Tên</label>
            <input
              {...form.register("name")}
              placeholder="Nhập tên của bạn..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              {...form.register("email")}
              placeholder="Nhập email của bạn..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              {...form.register("password")}
              placeholder="Nhập mật khẩu của bạn..."
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  </div>
  
  );
}
