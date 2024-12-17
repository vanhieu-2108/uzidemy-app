"use client";

import { useGetPostById } from "@/queries/usePosts";
import { timeAgo } from "@/utils/utils";
import DOMPurify from "dompurify";

const BlogDetailPage = ({ params }: { params: { id: string } }) => {
  const { data } = useGetPostById(params.id);
  const postData = data?.payload.result;
  if (!postData) return null;
  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold mb-6 leading-tight">{postData.title}</h1>
      <div className="flex items-center mb-8">
        <img src="https://via.placeholder.com/48" alt="Tác giả" className="w-12 h-12 rounded-full" />
        <div className="ml-3">
          <p className="font-semibold text-lg">{postData.author}</p>
          <p className="text-sm text-gray-500">{timeAgo(postData.created_at)}</p>
        </div>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(postData.content) }}></div>
    </div>
  );
};

export default BlogDetailPage;
