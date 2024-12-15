import http from "@/lib/http";
import { Lecture } from "@/types/lectures";
import { Response } from "@/types/res";

export const lectureApis = {
  createLecture: (data: Lecture) =>
    http.post<
      Response<{
        message: string;
      }>
    >("/lectures", data),
  getLecture: (id: string) =>
    http.get<
      Response<
        Lecture & {
          next_lecture_id: string | null;
          prev_lecture_id: string | null;
        }
      >
    >(`/lectures/${id}`),
  getLecturesByChapter: (chapterId: string) =>
    http.get<
      Response<
        (Lecture & {
          next_lecture_id: string | null;
          prev_lecture_id: string | null;
        })[]
      >
    >(`/lectures/chapter/${chapterId}`),
  updateLecture: ({ id, data }: { id: string; data: Omit<Lecture, "_id"> }) =>
    http.put<
      Response<
        Lecture & {
          next_lecture_id: string | null;
          prev_lecture_id: string | null;
        }
      >
    >(`/lectures/${id}`, data),
  deleteLecture: (id: string) => http.delete<Response<{ message: string }>>(`/lectures/${id}`),
};
