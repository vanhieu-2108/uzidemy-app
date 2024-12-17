import http from "@/lib/http";
import {
  AddCourse,
  Course,
  CoursesContent,
  ResultAddCourse,
  ResultCourses,
  ResultUploadImage,
  ResultUploadVideo,
  UpdateCourse,
} from "@/types/courses";
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
  getCourse: (slug: string) =>
    http.get<Response<Course>>(`/courses/${slug}`, {
      cache: "no-store",
    }),
  uploadImage: (body: FormData) => http.post<Response<ResultUploadImage[]>>("/medias/upload-image", body),
  uploadVideo: (body: FormData) => http.post<Response<ResultUploadVideo[]>>("/medias/upload-video", body),
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
  getContentCourses: (id: string) => http.get<Response<CoursesContent[]>>(`/courses/${id}/content`),
  getCoursePurchased: () => http.get<Response<any>>("/courses/purchased"),
};

export default coursesApi;
