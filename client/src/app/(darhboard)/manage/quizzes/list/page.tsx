"use client";
import { IconPen, IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useDeleteQuizById, useGetQuizzesByChapter } from "@/queries/useQuizzes";
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
import Link from "next/link";
import { toast } from "react-toastify";

export default function page() {
  const searchParams = useGetSearchParams();
  const { data, refetch } = useGetQuizzesByChapter(searchParams.chapter_id);
  const quizzes = data?.payload.result;
  const deleteQuizMutaion = useDeleteQuizById();

  const handleDeleteQuiz = (quiz_id: string) => {
    deleteQuizMutaion.mutate(quiz_id, {
      onSuccess: (data) => {
        refetch();
        toast.success(data.payload.message);
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>STT</TableHead>
          <TableHead className="w-[100px]">Tên bài học</TableHead>
          <TableHead>Câu hỏi</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Câu trả lời</TableHead>
          <TableHead className="text-right">Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes &&
          quizzes?.length > 0 &&
          quizzes.map((quiz) =>
            quiz.questions.map((question, index) => {
              return (
                <TableRow key={`${quiz._id}-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{quiz.lecture.title}</TableCell>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>
                    {quiz._destroy ? (
                      <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-200 rounded-full">
                        DELETED
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-200 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ul>
                      {question.options.map((option) => (
                        <li key={option.option_id}>{option.correct_answer}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/manage/quizzes/${quiz._id}/edit`}>
                        <Button>
                          <IconPen />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button>
                            <IconTrash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa câu hỏi này không?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Đây chỉ là xóa mềm và bạn có thể khôi phục lại câu hỏi này sau.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuiz(quiz._id)}>Tiếp tục</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
      </TableBody>
    </Table>
  );
}
