"use client";
import { IconBook, IconEye, IconPen, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVND } from "@/lib/utils";
import { useDeleteCourse } from "@/queries/useCourses";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Course } from "@/types/courses";
import { useEffect, useState } from "react";

export default function Courses({ data }: { data: Course[] }) {
  const router = useRouter();
  const deleteCourseMutation = useDeleteCourse();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeleteCourse = async (id: string) => {
    deleteCourseMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.payload.message);
        router.refresh();
      },
    });
  };

  return (
    <div className="py-10">
      <Link href="/manage/courses/add">
        <Button className="mb-5">Thêm khóa học</Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Ảnh</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead className="hidden md:block">Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Giá gốc</TableHead>
            <TableHead>Giá giảm</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">
                <Image
                  alt={course.title}
                  src={course.image}
                  className="w-20 h-20 rounded-md object-cover"
                  width={200}
                  height={200}
                />
              </TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell className="max-w-[300px] hidden md:block">
                {course.description.slice(0, 100) + (course.description.length > 100 ? "..." : "")}
              </TableCell>
              <TableCell>
                {course.status === "ACTIVE" ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-200 rounded-full">
                    {course.status}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-200 rounded-full">
                    {course.status}
                  </span>
                )}
              </TableCell>
              <TableCell>{formatVND(course.original_price)}</TableCell>
              <TableCell>{formatVND(course.sale_price)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/${course.slug}`}>
                    <IconEye className="w-5 h-5" />
                  </Link>
                  <Link href={`/manage/courses/edit/${course.slug}`} title="Chỉnh sửa">
                    <IconPen className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/manage/courses/content/${course.slug}?course_id=${course._id}`}
                    title="Thêm nội dung khóa học"
                  >
                    <IconBook className="w-5 h-5" />
                  </Link>
                  {isClient && (
                    <button title="Xóa khóa học">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <IconTrash className="w-5 h-5" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa khóa học này không?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Khóa học này sẽ bị xóa nhưng vẫn có thể khôi phục lại.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course._id)}>
                              Tiếp tục
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
