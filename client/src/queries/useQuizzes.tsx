import quizzesApi from "@/apiRequests/quizzes";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: quizzesApi.createQuiz,
  });
};

export const useGetQuizzesByChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ["quizzes", chapterId],
    queryFn: () => quizzesApi.getQuizzesByChapter(chapterId),
  });
};

export const useGetZQuizById = (quizId: string, options: any) => {
  return useQuery({
    ...options,
    queryKey: ["quiz", quizId],
    queryFn: () => quizzesApi.getQuizById(quizId),
  });
};

export const useUpdateQuizById = () => {
  return useMutation({
    mutationFn: (data: { quiz_id: string; data: any }) => quizzesApi.updateQuizById(data.quiz_id, data.data),
  });
};

export const useDeleteQuizById = () => {
  return useMutation({
    mutationFn: quizzesApi.deleteQuizById,
  });
};

export const useCheckAnswerForQuiz = () => {
  return useMutation({
    mutationFn: quizzesApi.checkAnswerForQuiz,
  });
};

export const useGetQuizzesByLectureId = (lectureId: string) => {
  return useQuery({
    queryKey: ["quizzes", lectureId],
    queryFn: () => quizzesApi.getQuizzesByLectureId(lectureId),
  });
};

export const useCheckQuizAnswer = () => {
  return useMutation({
    mutationFn: quizzesApi.checkQuizAnswer,
  });
};
