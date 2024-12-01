import coursesApi from "@/apiRequests/courses";
import { AddCourse, Course } from "@/types/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getCourses(),
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (body: FormData) => coursesApi.uploadImage(body),
  });
};

export const useAddCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCourse) => coursesApi.addCourse(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
};

export const useGetCourse = (slug: string) => {
  return useQuery({
    queryKey: ["course"],
    queryFn: () => coursesApi.getCourse(slug),
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coursesApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });
    },
  });
};

export const useGetCoursesContent = (id: string) => {
  return useQuery({
    queryKey: ["coursesContent", id],
    queryFn: () => coursesApi.getContentCourses(id),
  });
};
