"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateChapter, useUpdateChapter } from "@/queries/useChapter";
import { useGetCourses } from "@/queries/useCourses";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { useCreateLecture } from "@/queries/useLecture";
import coursesApi from "@/apiRequests/courses";
import { toast } from "react-toastify";
import Link from "next/link";

const formSchema = z.object({
  slug: z.string({ required_error: "Slug không được để trống" }),
  title: z.string({ required_error: "Tiêu đề không được để trống" }),
  video_url: z.string({ required_error: "Video không được để trống" }),
  content: z.string({ required_error: "Nội dung không được để trống" }),
  course_id: z.string({ required_error: "Course id không được để trống" }),
  chapter_id: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [chapters, setChapters] = useState<{ title: string; course_id: string | null; _id?: string }[]>([]);
  const courseId = useSearchParams().get("course_id");
  const [editor, setEditor] = useState("");
  const createChapterMutation = useCreateChapter();
  const { data: courses, refetch } = useGetCourses();
  const [editChapter, setEditChapter] = useState<string>("");
  const updateChapterMutation = useUpdateChapter();
  const createLectureMutation = useCreateLecture();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  if (!courseId) return null;

  const handleAddChapter = () => {
    setChapters([...chapters, { title: `Chương ${chapters.length + 1}`, course_id: courseId }]);
    createChapterMutation.mutate({ title: `Chương ${chapters.length + 1}`, course_id: courseId });
  };

  useEffect(() => {
    if (courses) {
      const coursesData = courses.payload.result.data;
      const course = coursesData.find((course) => course._id === courseId);
      const arrChapter = course?.chapters.map((chapter) => ({
        title: chapter.title,
        course_id: courseId,
        _id: chapter._id,
      }));
      setChapters(arrChapter || []);
    }
  }, [courses]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      course_id: courseId,
      slug: "",
      title: "",
      video_url: "",
    },
  });

  function handleUpdateChapter(title: string) {
    const prevChapters = [...chapters];
    setChapters((prev) => prev.map((chapter) => (chapter._id === editChapter ? { ...chapter, title } : chapter)));
    updateChapterMutation.mutate(
      {
        id: editChapter,
        body: {
          title,
        },
      },
      {
        onError: () => {
          setChapters(prevChapters);
        },
        onSuccess: () => {
          refetch();
        },
      }
    );
  }

  async function onSubmit(values: FormData) {
    if (file) {
      const _values = { ...values };
      const formData = new FormData();
      formData.append("video", file);
      const res = await coursesApi.uploadVideo(formData);
      const videoUrl = res.payload.result[0].url;
      _values.video_url = videoUrl;
      _values.chapter_id = editChapter;
      createLectureMutation.mutate(_values as any, {
        onSuccess: (data) => {
          toast(data.payload.message);
          refetch();
          if (videoRef.current) {
            videoRef.current.value = "";
          }
          setEditor("");
        },
      });
    }
  }
  return (
    <div className="py-6">
      <Accordion type="single" collapsible>
        {chapters.map((chapter, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <div className="flex w-full">
                <div className="w-full">
                  {editChapter === chapter._id ? (
                    <Input
                      placeholder={chapter.title}
                      className="border-none outline-none placeholder:text-black"
                      ref={inputRef}
                    />
                  ) : (
                    <p>{chapter.title}</p>
                  )}
                </div>
                {editChapter === chapter._id ? (
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      onClick={() => {
                        setEditChapter("");
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        if (inputRef.current) {
                          handleUpdateChapter(inputRef.current.value);
                        }
                        setEditChapter("");
                      }}
                    >
                      Lưu
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end mr-4 w-max gap-2">
                    <Button
                      onClick={() => {
                        setEditChapter(chapter._id || "");
                      }}
                    >
                      Thêm
                    </Button>
                    <Link href={`/manage/lectures?chapter_id=${chapter._id}`}>
                      <Button>Danh sách bài giảng</Button>
                    </Link>
                  </div>
                )}
              </div>
            </AccordionTrigger>
            {chapter._id === editChapter && (
              <AccordionContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-5">
                    <div className="grid col-span-1 lg:col-span-2 gap-4 grid-cols-1 lg:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your title..."
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your slug..."
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                      render={() => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <div>
                              <MDEditor
                                value={editor}
                                onChange={(value) => {
                                  setEditor(value || "");
                                  form.setValue("content", value || "");
                                }}
                              />
                              <MDEditor.Markdown
                                style={{ whiteSpace: "pre-wrap" }}
                                source={editor}
                                className="hidden"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-black text-white p-2 rounded-lg mb-6  hover:text-black hover:border hover:bg-gray-300"
                    >
                      Lưu
                    </Button>
                  </form>
                </Form>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      <Button className="mt-5" onClick={handleAddChapter}>
        Thêm chương
      </Button>
    </div>
  );
}

export default function UpdateContent() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
