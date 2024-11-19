import http from "@/lib/http";
import { AddCourse, Course, ResultAddCourse, ResultCourses, ResultUploadImage, UpdateCourse } from "@/types/courses";
import { Response } from "@/types/res";

const coursesApi = {
  getCourses: () =>
    http.get<Response<ResultCourses>>("/courses", {
      cache: "no-store",
    }),
  getCourseToServer: (accessToken: string) =>
    http.get<Response<ResultCourses>>("/courses/admin", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  getCourse: (slug: string) => http.get<Response<Course>>(`/courses/${slug}`),
  uploadImage: (body: FormData) => http.post<Response<ResultUploadImage[]>>("/medias/upload-image", body),
  addCourse: (body: AddCourse) => http.post<Response<ResultAddCourse>>("/courses", body),
  updateCourse: (body: UpdateCourse) =>
    http.put<Response<Course>>(`/courses/${body._id}`, body, {
      cache: "no-store",
    }),
  deleteCourse: (id: string) =>
    http.delete<
      Response<{
        message: string;
      }>
    >(`/courses/${id}`, {
      cache: "no-store",
    }),
};

export default coursesApi;
