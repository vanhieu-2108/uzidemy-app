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

const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  username: z.string().min(1, "Username không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  bio: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { setUser } = useContext(AppProviderContext);
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Phước Vũ",
      username: "phuocvu",
      email: "phuocvu@example.com",
      bio: "Đây là một bio mẫu.",
    },
  });

  function onSubmit(values: FormData) {
    console.log(values);
    // Phần xử lý cập nhật 
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg relative">
    
      <Button type="submit" className="absolute top-4 right-4 px-7 py-7 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-600">
            Cập nhật 
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-5">
          <div className="flex flex-col sm:flex-row mt-16">
            <div className="flex-1 pr-4 mb-4 sm:mb-0">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên của bạn..."
                        {...field}
                        className="p-6 border border-gray-300 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Username:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập username..."
                        {...field}
                        className="p-6 border border-gray-300 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 pl-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email của bạn..."
                        {...field}
                        className="p-6 border border-gray-300 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Bio:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập bio của bạn..."
                        {...field}
                        className="p-6 border border-gray-300 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

        
        </form>
      </Form>
    </div>
  );
}
