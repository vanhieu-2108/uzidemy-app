import { Button } from "@/components/ui/button";
import { Course as CourseType } from "@/types/courses";
import { formatPriceToVND } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

export default function Course({ course, isLearn = false }: { course: CourseType; isLearn?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Image src={course.image} alt={course.title} width={300} height={200} className="w-full h-[200px] object-cover" />
      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-2xl mb-5 line-clamp-1">{course.title}</h3>
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <span className="text-gray-500 text-lg flex items-center font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
              {course.view_count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 line-through font-bold text-sm">
              {formatPriceToVND(course.original_price)}
            </span>
            <span className="text-red-500 text-lg font-bold">{formatPriceToVND(course.sale_price)}</span>
          </div>
        </div>
        <Link
          href={isLearn ? `/lecture?id=${course.chapters[0].lectures[0]}&course_id=${course._id}` : `/${course.slug}`}
        >
          <Button className="mt-5 w-full bg-blue-500 text-white py-2 h-14 rounded text-lg font-bold">
            Xem chi tiết
          </Button>
        </Link>
      </div>
    </div>
  );
}
