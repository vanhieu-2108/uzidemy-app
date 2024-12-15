"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
import Image from "next/image";
import { useAddCourse, useUploadImage } from "@/queries/useCourses";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EntityError } from "@/lib/http";

const formSchema = z.object({
    title: z.string().nonempty("Tiêu đề không được để trống"),
    description: z.string().nonempty("Mô tả không được để trống"),
    author: z.string().nonempty("Tác giả không được để trống"),
    image: z.string().url().optional(),
  });
type FormData = z.infer<typeof formSchema>;
const AddBlog = () => {

    const [file, setFile] = useState<File | null>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const uploadImageMutation = useUploadImage();
    const addCourseMutation = useAddCourse();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        author: "",
        image: "",
      },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (form.formState.isSubmitting) return;
      try {
        const formData = new FormData();
        formData.append("image", file as Blob);
        const resImage = await uploadImageMutation.mutateAsync(formData);
        const urlImage = resImage.payload.result[0].url;
        // const data = await addCourseMutation.mutateAsync({ ...values, image: urlImage });
        // toast.success(data.payload.message);
        
        router.push("/blog");
          
      } catch (error: any) {
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
      }
    }
    function handleRemoveImage() {
      setFile(null);
      form.setValue("image", "");
      if (imageRef.current) {
        imageRef.current.value = "";
      }
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))} className="space-y-8 pt-8 pb-16">
        <div className="grid grid-cols-2 gap-10">
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tác giả</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="Enter your " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
        </div>
        <div className="grid grid-cols-2 gap-10">
          <FormField
            control={form.control}
            name="image"
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
                            form.setValue("image", URL.createObjectURL(e.target.files[0]));
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
        </div>
        <Button type="submit" className="w-full h-12">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default AddBlog
