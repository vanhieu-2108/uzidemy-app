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
  checkAnswerForQuiz(body: any) {
    return http.post<
      Response<{
        message: string;
        isCorrect: boolean;
      }>
    >("/quizzes/answer", body);
  },
  getQuizzesByLectureId: (lectureId: string) => http.get<Response<Quiz[]>>(`/quizzes/lecture/${lectureId}`),
  checkQuizAnswer(body: any) {
    return http.post<
      Response<{
        isCorrect: boolean;
      }>
    >("/quizzes/answer", body);
  },
};

export default quizzesApi;
