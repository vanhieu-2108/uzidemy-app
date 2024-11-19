import coursesApi from "@/apiRequests/courses";
import Courses from "@/app/(darhboard)/manage/courses/courses";
import { cookies } from "next/headers";

export default async function CoursesPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return null;
  const res = await coursesApi.getCourseToServer(accessToken);
  const data = await res.payload.result.data;
  return <Courses data={data} />;
}
