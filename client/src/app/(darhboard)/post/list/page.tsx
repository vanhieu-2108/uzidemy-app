"use client";
import { IconPen } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetPosts } from "@/queries/usePosts";
import Image from "next/image";
import Link from "next/link";
export default function page() {
  const { data } = useGetPosts();
  const posts = data?.payload.result;
  return (
    <Table className="mt-5">
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Nội dung</TableHead>
          <TableHead>Tác giả</TableHead>
          <TableHead>Ảnh</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <TableRow key={post._id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.content.slice(0, 50) + "..."}</TableCell>
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
                <Link href={`/post/edit/${post._id}`}>
                  <Button>
                    <IconPen />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
