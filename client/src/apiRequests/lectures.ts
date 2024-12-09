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
};
