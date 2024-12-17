"use client";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaPlayerInstance, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { useGetCoursesContent } from "@/queries/useCourses";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useGetLecture } from "@/queries/useLecture";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Comments from "@/components/comments/Comments";
import { useRef } from "react";
import { useCreateProgress, useGetProgressByCourseId } from "@/queries/useProgress";
import { Progress } from "@/components/ui/progress";
import CoursesContent from "@/components/courses-content/CoursesContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizAnswers from "@/components/quiz-answers/QuizAnswers";

export default function Lecture() {
  const seachParams = useGetSearchParams();
  const playerRef = useRef<MediaPlayerInstance>(null);
  const { course_id, id } = useGetSearchParams();
  const { data } = useGetCoursesContent(course_id);
  const { data: resLecture } = useGetLecture(id);
  const coursesContent = data?.payload.result;
  const router = useRouter();
  const dataLecture = resLecture?.payload.result;
  const createProgressMutation = useCreateProgress();
  const { data: progressData, refetch } = useGetProgressByCourseId(dataLecture?.course_id as string, {
    enabled: !!dataLecture?.course_id,
  });

  const watchedLectures = (progressData as any)?.payload.data.watchedLectures.map((item: any) => item.lecture_id);

  // Kiểm tra nếu không có course_id, id hoặc dataLecture
  if (!course_id || !id || !dataLecture) return null;

  // Xử lý điều hướng bài giảng tiếp theo hoặc trước đó
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

  const handleOnEnded = () => {
    createProgressMutation.mutate(
      {
        course_id: dataLecture.course_id,
        lecture_id: dataLecture._id,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            refetch();
            handleNextLecture();
          }, 1000);
        },
      }
    );
  };
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-6 py-10">
        <div>
          <MediaPlayer
            ref={playerRef}
            crossOrigin="anonymous"
            className="aspect-video"
            title="Sprite Fight"
            src={dataLecture?.video_url}
            onEnded={handleOnEnded}
            poster={"../../../../public/loading.gif"}
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
          <Tabs defaultValue="desc" className="w-full mt-10">
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-gray-100 p-1">
              <TabsTrigger
                value="desc"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-gray-200 hover:text-gray-700"
              >
                Nội dung
              </TabsTrigger>
              <TabsTrigger
                value="cmt"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-gray-200 hover:text-gray-700"
              >
                Bình luận
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-gray-200 hover:text-gray-700"
              >
                Bài kiểm tra
              </TabsTrigger>
            </TabsList>
            <TabsContent value="desc">
              <div className="mt-10">
                <Markdown className={"content"} rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
                  {dataLecture.content}
                </Markdown>
              </div>
            </TabsContent>
            <TabsContent value="cmt">
              <Comments id={id} />
            </TabsContent>
            <TabsContent value="quiz">
              <QuizAnswers
                lecture_id={seachParams?.id}
                answers={[
                  {
                    question: "What is the capital of France?",
                    options: [
                      { option_id: "1", correct_answer: "Paris" },
                      { option_id: "2", correct_answer: "London" },
                      { option_id: "3", correct_answer: "Berlin" },
                      { option_id: "4", correct_answer: "Madrid" },
                    ],
                    userAnswer: "1",
                  },
                  {
                    question: "Which is the largest planet in the solar system?",
                    options: [
                      { option_id: "1", correct_answer: "Earth" },
                      { option_id: "2", correct_answer: "Mars" },
                      { option_id: "3", correct_answer: "Jupiter" },
                      { option_id: "4", correct_answer: "Saturn" },
                    ],
                    userAnswer: "3",
                  },
                  {
                    question: "Which programming language is known as the language of the web?",
                    options: [
                      { option_id: "1", correct_answer: "Java" },
                      { option_id: "2", correct_answer: "JavaScript" },
                      { option_id: "3", correct_answer: "Python" },
                      { option_id: "4", correct_answer: "C++" },
                    ],
                    userAnswer: "2",
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col sticky top-0 right-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-black flex-shrink-0">
              {(Math.round((progressData as any)?.payload.data.progressPercentage) as number) || 0}%
            </span>
            <Progress value={(progressData as any)?.payload.data.progressPercentage as number} />
          </div>
          <CoursesContent coursesContent={coursesContent || []} id={id} watchedLectures={watchedLectures} />
        </div>
      </div>
    </>
  );
}
