"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGetUserById, useUpdateUserById } from "@/queries/useAccount";
import { useUploadImage } from "@/queries/useCourses";
import { toast } from "react-toastify";
import { useAppProvider } from "@/components/app-provider";
import { setUserToLocalStorage } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const personalInfoSchema = z.object({
  fullname: z.string(),
  email: z.string().email("Email không hợp lệ"),
  avatar: z.string(),
  status: z.string().optional(),
});
type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export default function page({ params }: { params: { id: string } }) {
  const { user, setUser } = useAppProvider();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { data } = useGetUserById(params.id);
  const userData = data?.payload.result;
  const updateUserByIdMutation = useUpdateUserById();
  const uploadImageMutation = useUploadImage();
  const personalInfoForm = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullname: "",
      email: "",
      avatar: "",
      status: "",
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
      updateUserByIdMutation.mutate(
        { id: params.id, body: data },
        {
          onSuccess: (data) => {
            toast.success("Cập nhật thông tin thành công");
            if (user?._id === params.id) {
              setUser(data.payload.result);
              setUserToLocalStorage(data.payload.result);
            }
            router.back();
          },
          onError: (error) => {
            console.log("error", error);
          },
        }
      );
    } else {
      updateUserByIdMutation.mutate(
        { id: params.id, body: values },
        {
          onSuccess: (data) => {
            console.log("data", data);
            toast.success("Cập nhật thông tin thành công");
            if (user?._id === params.id) {
              setUser(data.payload.result);
              setUserToLocalStorage(data.payload.result);
            }
            router.back();
          },
          onError: (error) => {
            console.log("error", error);
          },
        }
      );
    }
  }
  function handleRemoveImage() {
    setFile(null);
    personalInfoForm.setValue("avatar", "");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  }

  useEffect(() => {
    if (userData) {
      personalInfoForm.reset({
        fullname: userData.fullname,
        email: userData.email,
        avatar: userData.avatar || "",
      });
    }
  }, [userData]);

  const watchAvatar = personalInfoForm.watch("avatar");

  return (
    <Form {...personalInfoForm}>
      <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4 mb-5">
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={(value) => personalInfoForm.setValue("status", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={data?.payload.result.status} />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="DELEDTED">DELEDTED</SelectItem>
                </SelectContent>
              </Select>
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
                {!file && !Boolean(watchAvatar) && (
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
                {(file || Boolean(watchAvatar)) && (
                  <div className="flex relative flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <Image
                      src={file ? URL.createObjectURL(file) : (watchAvatar as string)}
                      alt="image"
                      fill
                      className="object-contain"
                    />
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
  );
}
