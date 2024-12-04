"use client";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaPlayerInstance, MediaProvider, useMediaState } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useGetCoursesContent } from "@/queries/useCourses";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useGetLecture } from "@/queries/useLecture";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Comments from "@/components/comments/Comments";
import { useRef } from "react";

export default function Lecture() {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const { course_id, id } = useGetSearchParams();
  const { data } = useGetCoursesContent(course_id);
  const { data: resLecture } = useGetLecture(id);
  const coursesContent = data?.payload.result;
  const router = useRouter();
  const dataLecture = resLecture?.payload.result;
  const ended = useMediaState("ended", playerRef);
  if (!course_id || !id || !dataLecture) return null;
  const handleNextLecture = () => {
    if (dataLecture?.next_lecture_id) {
      router.push(`/lecture?id=${dataLecture.next_lecture_id}&course_id=${course_id}`);
    }
  };
  const handlePrevLecture = () => {
    if (dataLecture?.prev_lecture_id) {
      router.push(`/lecture?id=${dataLecture.prev_lecture_id}&course_id=${course_id}`);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[600px,1fr] gap-6 py-10">
      <div>
        <MediaPlayer
          ref={playerRef}
          crossOrigin="anonymous"
          className="aspect-video z-0"
          title="Sprite Fight"
          src={dataLecture?.video_url}
        >
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
        <h1 className="text-2xl font-bold text-black mt-5">{dataLecture?.title}</h1>
        <div className="flex items-center justify-between mt-5">
          <RainbowButton disabled={!dataLecture?.prev_lecture_id} onClick={handlePrevLecture}>
            Bài trước
          </RainbowButton>
          <RainbowButton onClick={handleNextLecture} disabled={!dataLecture?.next_lecture_id}>
            Bài sau
          </RainbowButton>
        </div>
        <div className="mt-10">
          <Markdown className={"content"} rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
            {dataLecture.content}
          </Markdown>
        </div>
        <Comments id={id} />
      </div>
      <div className="flex flex-col sticky top-0 right-0">
        {coursesContent?.map((content) => (
          <Accordion type="single" collapsible key={content._id}>
            <AccordionItem value="item-1">
              <AccordionTrigger>{content.title}</AccordionTrigger>
              <AccordionContent>
                {content.lectures.length === 0 ? (
                  <p className="text-sm text-black">Nội dung đang được cập nhật...</p>
                ) : (
                  <div className="flex flex-col gap-5">
                    {content.lectures.map((lecture) => (
                      <Link
                        href={`/lecture?id=${lecture._id}&course_id=${lecture.course_id}`}
                        className={cn(`flex items-center gap-2`, {
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
                      </Link>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
