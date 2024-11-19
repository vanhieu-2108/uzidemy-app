import React from "react";
import Details from "./details";
import coursesApi from "@/apiRequests/courses";
import { notFound } from "next/navigation";

async function page({ params }: { params: { courseId: string } }) {
  const res = await coursesApi.getCourse(params.courseId).catch(() => {
    notFound();
  });
  const course = res.payload.result;
  return (
    <div className="py-10">
      <Details course={course} />
    </div>
  );
}

export default page;
