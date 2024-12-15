import { lectureApis } from "@/apiRequests/lectures";
import { Lecture } from "@/types/lectures";
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

export const useGetLecturesByChapter = (chapterId: string, options?: any) => {
  return useQuery({
    ...options,
    queryKey: ["lectures", chapterId],
    queryFn: () => lectureApis.getLecturesByChapter(chapterId),
  });
};

export const useUpdateLectureMutation = () => {
  return useMutation({
    mutationFn: lectureApis.updateLecture,
  });
};

export const useDeleteLectureMutation = () => {
  return useMutation({
    mutationFn: lectureApis.deleteLecture,
  });
};
