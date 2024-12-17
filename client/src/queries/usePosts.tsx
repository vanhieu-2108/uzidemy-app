import { postsApis } from "@/apiRequests/posts";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postsApis.getPosts,
  });
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: postsApis.createPosts,
  });
};

export const useGetPostById = (id: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsApis.getPostById(id),
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: any }) => postsApis.updatePost(postId, data),
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: postsApis.detelePost,
  });
};
