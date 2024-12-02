import { lectureApis } from "@/apiRequests/lectures";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateLecture = () => {
  return useMutation({
    mutationFn: lectureApis.createLecture,
  });
};

export const useGetLecture = (id: string) => {
  return useQuery({
    queryKey: ["lecture", id],
    queryFn: () => lectureApis.getLecture(id),
  });
};

export const useGetLecturesByChapter = (chapterId: string) => {
  return useQuery({
    queryKey: ["lectures", chapterId],
    queryFn: () => lectureApis.getLecturesByChapter(chapterId),
  });
};

export const useUpdateLectureMutation = () => {
  return useMutation({
    mutationFn: lectureApis.updateLecture,
  });
};
