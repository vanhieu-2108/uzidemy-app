"use client";

import { IconTrash } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeletePost, useGetPosts, useUpdatePost } from "@/queries/usePosts";
import { EPostStatus, Post } from "@/types/post";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Page() {
  const { data, refetch } = useGetPosts();
  const [selectOption, setSelectOption] = useState("");
  const posts = data?.payload?.result || [];
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const getStatusClass = (status: EPostStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PUBLIC":
        return "bg-green-100 text-green-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdatePost = async (postId: string, status: EPostStatus) => {
    const findPost = posts.find((post) => post._id === postId) as Post;
    await updatePostMutation.mutateAsync(
      {
        postId,
        data: {
          title: findPost.title,
          content: findPost.content,
          image: findPost.image,
          author: findPost.author,
          status,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data.payload.message);
          refetch();
        },
        onError: (error) => {
          console.log("error", error);
        },
      }
    );
  };

  const handleDeletePost = (postId: string) => {
    deletePostMutation.mutate(postId, {
      onSuccess: (data) => {
        toast.success(data.payload.message);
        refetch();
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  return (
    <div className="p-5">
      <Table className="mt-5 border">
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead>Ảnh</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.content.slice(0, 20) + "..."}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={100}
                    height={100}
                    className="w-[100px] h-[100px] object-cover"
                  />
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusClass(post.status)}`}>
                        {post.status}
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Thay đổi trạng thái bài viết "{post.title}"</AlertDialogTitle>
                        <Select onValueChange={(value) => setSelectOption(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={post.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                            <SelectItem value="DELETED">DELETED</SelectItem>
                          </SelectContent>
                        </Select>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUpdatePost(post._id, selectOption as EPostStatus)}>
                          Tiếp tục
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button>
                        <IconTrash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa bài viết "{post.title}" không?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Xóa bài viết này nhưng bạn vẫn có thể khôi phục lại bài viết này sau.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeletePost(post._id)}>Tiếp tục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Không có bài viết nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
