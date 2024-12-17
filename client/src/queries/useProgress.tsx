import { progressApis } from "@/apiRequests/progress";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateProgress = () => {
  return useMutation({
    mutationFn: progressApis.createProgess,
  });
};

export const useGetProgressByCourseId = (course_id: string, options?: any) => {
  return useQuery({
    ...options,
    queryKey: ["progress", course_id],
    queryFn: () => progressApis.getProgressByCourseId(course_id) as any,
  });
};
