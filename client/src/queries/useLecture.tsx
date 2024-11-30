import { lectureApis } from "@/apiRequests/lectures";
import { useMutation, useQuery } from "@tanstack/react-query";

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
