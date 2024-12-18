"use client";
import { useGetPosts } from "@/queries/usePosts";
import { timeAgo } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogPage() {
  const { data } = useGetPosts();
  const posts = data?.payload.result;
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-8">Danh sách bài viết</h1>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <Link href={`/blog/${post._id}`} key={post._id}>
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer">
                  <div className="p-4 flex-grow">
                    <div className="flex items-center mb-2">
                      <Image
                        src={post.user.avatar}
                        alt={post.title}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-semibold">{post.author}</p>
                        <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-xl mt-5">{post.title}</h3>
                  </div>
                  <div className="w-1/5">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
