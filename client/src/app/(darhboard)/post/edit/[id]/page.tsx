"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { useAppProvider } from "@/components/app-provider";
import { useEffect, useRef, useState } from "react";
import { useUploadImage } from "@/queries/useCourses";
import Image from "next/image";
import { useCreatePost, useGetPostById, useUpdatePost } from "@/queries/usePosts";
import { toast } from "react-toastify";

const formSchema = z.object({
  author: z.string().min(2, "Họ tên không được ít hơn 2 ký tự").max(50, "Họ tên không được nhiều hơn 50 ký tự"),
  content: z.string().min(1, "Nội dung không được ít hơn 1 ký tự"),
  image: z.string(),
  title: z.string().min(2, "Tiêu đề không được ít hơn 2 ký tự").max(100, "Tiêu đề không được nhiều hơn 100 ký tự"),
});

export default function Page({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const uploadImageMutation = useUploadImage();
  const updatePostMutation = useUpdatePost();
  const { data } = useGetPostById(params.id);
  const postData = data?.payload.result;

  const { user } = useAppProvider();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (file) {
      const formData = new FormData();
      formData.append("image", file as Blob);
      const resImage = await uploadImageMutation.mutateAsync(formData);
      const urlImage = resImage.payload.result[0].url;
      const data = { ...values, image: urlImage };
      updatePostMutation.mutate(
        {
          data,
          postId: params.id,
        },
        {
          onSuccess: (data) => {
            toast.success(data.payload.message);
          },
          onError: (error) => {
            console.log("error", error);
          },
        }
      );
    } else {
      updatePostMutation.mutate(
        {
          data: values,
          postId: params.id,
        },
        {
          onSuccess: (data) => {
            toast.success(data.payload.message);
          },
          onError: (error) => {
            console.log("error", error);
          },
        }
      );
    }
  }

  useEffect(() => {
    if (user) {
      form.setValue("author", user.fullname);
    }
    if (postData) {
      form.setValue("title", postData.title);
      form.setValue("content", postData.content);
      form.setValue("image", postData.image);
    }
  }, [user, postData]);

  function handleRemoveImage() {
    setFile(null);
    form.setValue("image", "");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  }

  const watchImage = form.watch("image");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-12">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tác giả</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your author" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh</FormLabel>
                <div className="flex items-center justify-center w-full">
                  {!file && !Boolean(watchImage) && (
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
                            form.setValue("image", URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                    </label>
                  )}
                  {(file || Boolean(watchImage)) && (
                    <div className="flex relative flex-col items-center justify-center w-full h-64  border-gray-300 border rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <Image
                        src={file ? URL.createObjectURL(file) : (watchImage as string)}
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
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nội dung</FormLabel>
              <FormControl>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  init={{
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                  }}
                  value={field.value}
                  onEditorChange={(content) => field.onChange(content)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
