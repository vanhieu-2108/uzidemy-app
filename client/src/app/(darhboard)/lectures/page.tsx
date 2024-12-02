"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useGetLecturesByChapter, useUpdateLectureMutation } from "@/queries/useLecture";
import { Fragment, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import coursesApi from "@/apiRequests/courses";
import { toast } from "react-toastify";
import { EntityError } from "@/lib/http";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  slug: z.string().nonempty(),
  title: z.string().nonempty(),
  video_url: z.string().nonempty(),
  content: z.string().nonempty(),
});

export default function Page() {
  const searchParams = useGetSearchParams();
  const router = useRouter();
  const { data, refetch } = useGetLecturesByChapter(searchParams.chapter_id);
  const lectures = data?.payload.result;
  const videoRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<any | null>(null);
  const updateLectureMutation = useUpdateLectureMutation();
  const [isClient, setIsClient] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      video_url: "",
      content: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let _values = { ...values };
    if (file) {
      const formData = new FormData();
      formData.append("video", file);
      const res = await coursesApi.uploadVideo(formData);
      const videoUrl = res.payload.result[0].url;
      _values = { ...values, video_url: videoUrl };
    }
    updateLectureMutation.mutate(
      {
        id: selectedLecture._id,
        data: {
          ..._values,
          chapter_id: searchParams.chapter_id,
          course_id: selectedLecture.course_id,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật bài giảng thành công");
          refetch();
        },
        onError: (error) => {
          if (error instanceof EntityError) {
            const errors = error.payload.errors;
            for (const key in errors) {
              form.setError(key as keyof z.infer<typeof formSchema>, {
                type: "server",
                message: errors[key].msg,
              });
            }
            return;
          }
          toast.error(error.message);
          throw error;
        },
      }
    );
  }

  function handleSelectLecture(lecture: any) {
    setSelectedLecture(lecture);
    form.reset({
      slug: lecture.slug,
      title: lecture.title,
      video_url: lecture.video_url,
      content: lecture.content,
    });
  }

  return (
    <Fragment>
      {isClient && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Tiêu đề</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Đường dẫn</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(lectures) && lectures.length > 0 ? (
              lectures.map((lecture) => (
                <TableRow key={lecture._id}>
                  <TableCell>{lecture.title}</TableCell>
                  <TableCell>{lecture.content}</TableCell>
                  <TableCell>{lecture.slug}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          form.reset();
                          setFile(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => handleSelectLecture(lecture)}>Cập nhật</Button>
                      </DialogTrigger>
                      <DialogContent className="h-[90%] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{lecture.title}</DialogTitle>
                          <DialogDescription>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                                <FormField
                                  control={form.control}
                                  name="slug"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Đường dẫn</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter your slug" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
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
                                  name="video_url"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Tải lên video</FormLabel>
                                      <FormControl>
                                        <div className="flex items-center justify-center w-full">
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
                                                <span className="font-semibold">{file?.name || "Click to upload"}</span>
                                              </p>
                                            </div>
                                            <input
                                              pattern=".*\.(mp4|webm|ogg|mkv|avi|mov|wmv|flv|3gp|3g2|ts|mts|m2ts|vob|mpg|mpeg|mp1|mp2|mp3|m4a|aac|flac|ogg|wma)$"
                                              id="dropzone-file"
                                              type="file"
                                              className="hidden"
                                              ref={videoRef}
                                              onChange={(e) => {
                                                if (e.target.files) {
                                                  setFile(e.target.files[0]);
                                                }
                                              }}
                                            />
                                          </label>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="content"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nội dung</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter content" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full">
                                  Cập nhật
                                </Button>
                              </form>
                            </Form>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <Button>Xóa</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <p className="py-4 flex flex-col gap-2">
                Không có bài giảng nào <Button onClick={() => router.back()}>Quay lại</Button>
              </p>
            )}
          </TableBody>
        </Table>
      )}
    </Fragment>
  );
}
