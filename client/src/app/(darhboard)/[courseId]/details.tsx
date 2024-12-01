"use client";
import { Course } from "@/types/courses";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { formatPriceToVND } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { percentPrice } from "@/lib/utils";
import useCreatePayment from "@/queries/usePayment";
import { useRouter } from "next/navigation";
import { useAppProvider } from "@/components/app-provider";
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
import { useEffect, useState } from "react";

export default function Details({ course }: { course: Course }) {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAppProvider();
  const router = useRouter();
  const createPaymentMutation = useCreatePayment();
  const body = {
    amount: course.sale_price,
    description: `Mua khóa học tại Uzidemy`,
    course_id: "673ca8c9cfe3b26f3e8b3d94",
    user_id: user?._id,
  };
  const handlePayment = () => {
    createPaymentMutation.mutate(body, {
      onSuccess: (data) => {
        router.push(data.payload.result.checkoutURL);
      },
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className=" text-white py-4 flex items-center justify-between">
      <div className="w-full grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <div>
          <Image
            src={course.image}
            alt={course.title}
            width={800}
            height={400}
            className="rounded-lg object-cover w-full"
          />
          <h1 className="mt-4 text-2xl md:text-4xl font-bold text-gray-800">{course.title}</h1>
          <h2 className="mt-10 text-lg md:text-3xl font-bold text-gray-800">Nội dung khóa học</h2>
          <Markdown className={"content"} rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
            {course.description}
          </Markdown>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-10">Lợi ích</h2>
          <div className="flex flex-col gap-8 mt-5">
            {course.benefits.map((benefit) => (
              <div className="flex items-center gap-3" key={benefit}>
                <Checkbox checked />
                <p className="text-gray-800 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-10">Bắt buộc</h2>
          <div className="flex flex-col gap-8 mt-5">
            {course.requirements.map((requirement) => (
              <div className="flex items-center gap-3" key={requirement}>
                <Checkbox checked />
                <p className="text-gray-800 text-lg">{requirement}</p>
              </div>
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-10">Câu hỏi thường gặp</h2>
          <Accordion type="multiple" className="mt-5">
            {course.faqs.map((faq) => (
              <AccordionItem value={faq.question} key={faq.question}>
                <AccordionTrigger className="text-lg font-bold text-gray-800">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-800 text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg flex flex-col justify-center h-max sticky top-16 z-12 right-0">
          <div className="text-center mb-4 md:mb-6 flex relative items-center justify-between">
            <div className="flex items-center justify-end">
              <div className="text-xl font-bold text-red-500 m-2 ">{formatPriceToVND(course.sale_price)}</div>
              <div className="text-lg text-gray-500 line-through m-2 ">{formatPriceToVND(course.original_price)}</div>
            </div>
            <Badge>{percentPrice(course.original_price, course.sale_price)}%</Badge>
          </div>

          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-3 text-left text-gray-600 ml-2">Khóa học bao gồm:</h2>
            <ul className="space-y-2 text-gray-400 ml-2">
              <li className="flex items-center text-sm md:text-base">
                <p className="text-gray-500 text-base">Video quay Full HD</p>
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="text-gray-500 text-base">Có nhóm hỗ trợ</p>
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="text-gray-500 text-base">Tài liệu kèm theo</p>
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="text-gray-500 text-base">Giảng viên nhiệt tình</p>
              </li>
            </ul>
          </div>
          {isClient && (
            <AlertDialog>
              <AlertDialogTrigger>
                <div className="text-center mb-4 md:mb-6">
                  <button className="bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg w-full text-sm md:text-base">
                    Mua ngay
                  </button>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đơn hàng</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="flex gap-4">
                      <Image alt={course.title} src={course.image} width={100} height={100} className="rounded-lg" />
                      <p className="text-gray-800 text-lg font-bold">{course.title}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 text-lg font-bold">{formatPriceToVND(course.sale_price)}</p>
                        <p className="text-gray-500 line-through">{formatPriceToVND(course.original_price)}</p>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Thoát</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePayment}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <div id="payos-checkout"></div>
    </div>
  );
}
