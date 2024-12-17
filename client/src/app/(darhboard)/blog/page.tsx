"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default async function BlogPage() {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push("/manage/courses/blog/");
  };
  const handleBlogClick = () => {
    router.push("/blog/1");
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Bài viết nổi bật</h1>
      <div className="grid gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex cursor-pointer" onClick={handleBlogClick}>
            <div className="p-4 flex-grow">
              <div className="flex items-center mb-2">
                <img
                  src="https://files.fullstack.edu.vn/f8-prod/avatars/qCQW6A2FYv1KV1pproosFIlIXh3EyT0fAQnO1kvY.png"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-semibold">Lý Cao Nguyên</p>
                  <p className="text-xs text-gray-500">2 tháng trước</p>
                </div>
              </div>
              <h3 className="font-semibold text-xl">
                Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày
              </h3>
              <p className="text-sm text-gray-700 mt-2">
                Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và
                200 bài viết...
              </p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-medium text-gray-500">Front-end</span>
                <span className="text-xs text-gray-500">4 phút đọc</span>
              </div>
            </div>
            <div className="w-1/5">
              <img
                src="https://files.fullstack.edu.vn/f8-prod/blog_posts/9976/65fa652ce3a64.jpg"
                alt="Minh hoạ"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
