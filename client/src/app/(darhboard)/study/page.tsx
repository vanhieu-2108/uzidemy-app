"use client";
import { useAppProvider } from "@/components/app-provider";
import Course from "@/components/course/Course";
import { useGetUserById } from "@/queries/useAccount";
import { useGetCourses } from "@/queries/useCourses";

export default function Page() {
  const { user } = useAppProvider();
  const { data: dataRes } = useGetCourses();
  const { data: dataUser } = useGetUserById(user?._id as string);
  const coursesId = dataUser?.payload.result?.courses;
  const data = dataRes?.payload.result.data;
  const filteredCourses = data?.filter((course) => coursesId?.includes(course._id));
  if (!filteredCourses) return null;

  return (
    <div>
      <div className="py-12">
        <div className="font-bold text-5xl mb-6">Học Tập</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Course isLearn key={course._id} course={course} />
          ))}
        </div>
      </div>
      {filteredCourses.length <= 0 && <h1 className="text-4xl font-bold text-center">Chưa có khóa học nào</h1>}
    </div>
  );
}
