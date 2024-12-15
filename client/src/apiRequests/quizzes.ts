import http from "@/lib/http";
import { Quiz } from "@/types/quiz";
import { Response } from "@/types/res";

const quizzesApi = {
  createQuiz: (body: any) =>
    http.post<
      Response<{
        message: string;
      }>
    >("/quizzes", body),
  getQuizzesByChapter: (chapterId: string) =>
    http.get<Response<Quiz[]>>(`/quizzes/chapter/${chapterId}`, {
      cache: "no-store",
    }),
  getQuizById: (quizId: string) => http.get<Response<Quiz>>(`/quizzes/${quizId}`),
  updateQuizById: (quizId: string, body: any) => http.put<Response<Quiz>>(`/quizzes/${quizId}`, body),
  deleteQuizById: (quizId: string) =>
    http.delete<
      Response<{
        message: string;
      }>
    >(`/quizzes/${quizId}`),
};

export default quizzesApi;
