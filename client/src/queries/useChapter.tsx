import chaptersApi from "@/apiRequests/chapters";
import { CreateChapter } from "@/types/chaptes";
import { useMutation } from "@tanstack/react-query";

export const useCreateChapter = () => {
  return useMutation({
    mutationFn: chaptersApi.createChapter,
  });
};

export const useUpdateChapter = () => {
  return useMutation({
    mutationFn: (variables: { id: string; body: Omit<CreateChapter, "course_id"> }) =>
      chaptersApi.updateChapter(variables.id, variables.body),
  });
};

export const deleteChapter = () => {
  return useMutation({
    mutationFn: chaptersApi.deleteChapter,
  });
};
