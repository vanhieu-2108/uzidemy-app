"use client";
import { IconCheck } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { CoursesContent } from "@/types/courses";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  coursesContent: CoursesContent[];
  id?: string;
  isNavigation?: boolean;
  watchedLectures?: string[];
}

export default function CoursesContent({ coursesContent, id, isNavigation = true, watchedLectures }: Props) {
  const navigate = useRouter();
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>();
  useEffect(() => {
    const activeContent = coursesContent.find((content) => content.lectures.some((lecture) => lecture._id === id));
    setActiveAccordion(activeContent?._id);
  }, [id, coursesContent]);

  const handleLectureClick = (lectureId: string, courseId: string) => {
    if (isNavigation) {
      navigate.push(`/lecture?id=${lectureId}&course_id=${courseId}`);
    }
  };

  return (
    <div>
      {coursesContent?.map((content) => (
        <Accordion
          type="single"
          collapsible
          key={content._id}
          value={activeAccordion === content._id ? content._id : undefined}
          onValueChange={(value) => setActiveAccordion(value)}
        >
          <AccordionItem value={content._id}>
            <AccordionTrigger className="text-gray-900 font-bold text-base">{content.title}</AccordionTrigger>
            <AccordionContent>
              {content.lectures.length === 0 ? (
                <p className="text-sm text-black">Nội dung đang được cập nhật...</p>
              ) : (
                <div className="flex flex-col gap-5">
                  {content.lectures.map((lecture) => (
                    <div
                      onClick={() => handleLectureClick(lecture._id, lecture.course_id)}
                      className={cn(`flex items-center gap-2 cursor-pointer text-gray-800`, {
                        "text-blue-500": lecture._id === id,
                      })}
                      key={lecture._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-monitor-play"
                      >
                        <path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z" />
                        <path d="M12 17v4" />
                        <path d="M8 21h8" />
                        <rect x={2} y={3} width={20} height={14} rx={2} />
                      </svg>
                      {lecture.title}
                      {watchedLectures?.includes(lecture._id) && <IconCheck className="w-4 h-4 text-green-500" />}
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
