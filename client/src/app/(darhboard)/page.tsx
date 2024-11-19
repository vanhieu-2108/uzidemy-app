import coursesApi from "@/apiRequests/courses";
import Course from "@/components/course/Course";

export default async function Page() {
  const res = await coursesApi.getCourses();
  const data = res.payload.result.data;
  return (
    <div className="py-12">
      <div className="font-bold text-5xl mb-6">Khám phá</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((course) => (
          <Course key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
