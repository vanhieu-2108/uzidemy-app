import http from "@/lib/http";
import { Post } from "@/types/post";
import { Response } from "@/types/res";

export const postsApis = {
  getPosts: () => http.get<Response<Post[]>>("/posts"),
  createPosts: (data: any) =>
    http.post<
      Response<{
        message: string;
      }>
    >("/posts", data),
  getPostById: (postId: string) => http.get<Response<Post>>(`/posts/${postId}`),
  updatePost: (postId: string, data: any) => http.put<Response<Post>>(`/posts/${postId}`, data),
  detelePost: (postId: string) =>
    http.delete<
      Response<{
        message: string;
      }>
    >(`/posts/${postId}`),
};
