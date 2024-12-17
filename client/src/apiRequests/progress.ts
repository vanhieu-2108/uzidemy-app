import http from "@/lib/http";
import { DataGetProgressByCourseId } from "@/types/progress";
import { Response } from "@/types/res";

export const progressApis = {
  createProgess: (body: { lecture_id: string; course_id: string }) =>
    http.post<
      Response<{
        message: string;
      }>
    >(`/progress`, body),
  getProgressByCourseId: (course_id: string) => http.get<Response<DataGetProgressByCourseId>>(`/progress/${course_id}`),
};
