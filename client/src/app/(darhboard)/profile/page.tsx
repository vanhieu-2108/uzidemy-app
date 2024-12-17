"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppProvider } from "@/components/app-provider";
import { useUploadImage } from "@/queries/useCourses";
import { useChangePassword, useUpdateMe } from "@/queries/useAccount";
import { toast } from "react-toastify";
import { setUserToLocalStorage } from "@/lib/utils";

const personalInfoSchema = z.object({
  fullname: z.string(),
  email: z.string().email("Email không hợp lệ"),
  avatar: z.string(),
});

const changePasswordSchema = z
  .object({
    old_password: z.string().min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự"),
    new_password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirm_new_password: z.string().min(6, "Xác nhận mật khẩu mới phải có ít nhất 6 ký tự"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Mật khẩu mới và xác nhận mật khẩu phải trùng khớp",
    path: ["confirm_new_password"],
  });

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const [file, setFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useAppProvider();
  const uploadImageMutation = useUploadImage();
  const updateMeMutation = useUpdateMe();
  const changePasswordMutation = useChangePassword();

  const personalInfoForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullname: "",
      email: "",
      avatar: "",
    },
  });

  const changePasswordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function handlePersonalInfoSubmit(values: PersonalInfoData) {
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const resData = await uploadImageMutation.mutateAsync(formData);
      const imageURL = resData.payload.result[0].url;
      const data = {
        ...values,
        avatar: imageURL,
      };
      updateMeMutation.mutate(data, {
        onSuccess: (data) => {
          toast.success(data.payload.message);
          setUser(data.payload.result);
          setUserToLocalStorage(data.payload.result);
        },
        onError: (error) => {
          console.log("error", error);
        },
      });
    } else {
      updateMeMutation.mutate(values, {
        onSuccess: (data) => {
          toast.success(data.payload.message);
          setUser(data.payload.result);
          setUserToLocalStorage(data.payload.result);
        },
        onError: (error) => {
          console.log("error", error);
        },
      });
    }
  }

  function handleChangePasswordSubmit(values: ChangePasswordData) {
    console.log("values", values);
    changePasswordMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(data.payload.message);
        changePasswordForm.reset();
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  }

  function handleRemoveImage() {
    setFile(null);
    personalInfoForm.setValue("avatar", "");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  }

  useEffect(() => {
    if (user) {
      personalInfoForm.reset({
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
      });
    }
  }, [user]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-10 md:grid-cols-2">
      <Form {...personalInfoForm}>
        <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4 mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Thông tin cá nhân</h2>

          <FormField
            control={personalInfoForm.control}
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
            control={personalInfoForm.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ Và Tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name..."
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={personalInfoForm.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <div className="flex items-center justify-center w-full">
                  {!file && (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        ref={imageRef}
                        onChange={(e) => {
                          if (e.target.files) {
                            setFile(e.target.files[0]);
                            personalInfoForm.setValue("avatar", URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                  )}
                  {file && (
                    <div className="flex relative flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <Image src={URL.createObjectURL(file)} alt="image" fill className="object-contain" />
                      <Button className="absolute top-2 right-2" variant={"destructive"} onClick={handleRemoveImage}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-black text-white px-4 py-5 rounded-lg mb-6 hover:text-black hover:border hover:bg-gray-300"
          >
            Cập nhật
          </Button>
        </form>
      </Form>

      <Form {...changePasswordForm}>
        <form onSubmit={changePasswordForm.handleSubmit(handleChangePasswordSubmit)} className="space-y-4 mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Đổi mật khẩu</h2>

          <FormField
            control={changePasswordForm.control}
            name="old_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu hiện tại</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password..."
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={changePasswordForm.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password..."
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={changePasswordForm.control}
            name="confirm_new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password..."
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
            className="bg-black text-white px-4 py-5 rounded-lg mb-6 hover:text-black hover:border hover:bg-gray-300"
          >
            Cập nhật
          </Button>
        </form>
      </Form>
    </div>
  );
}
