import { Course } from "@/types/courses";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
export default function Details({ course }: { course: Course }) {
  return (
    <div className=" text-white py-4 md:py-10 flex items-center justify-between">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        <div className=" p-4 md:p-6 ">
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
          <Accordion type="multiple">
            {course.faqs.map((faq) => (
              <AccordionItem value={faq.question} key={faq.question}>
                <AccordionTrigger className="text-lg font-bold text-gray-800">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-800 text-base">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="bg-white border border-gray-300 mb-11 mt-6 p-4 md:p-6 rounded-lg flex flex-col justify-center h-max sticky top-16 z-12 right-0">
          {/* Price Section */}
          <div className="text-center mb-4 md:mb-6 flex relative ">
            <div className="text-xl  font-bold text-red-500 m-2 ">499.000 VNĐ</div>
            <div className="text-sm  text-gray-500 line-through m-2 ">699.000 VNĐ</div>
            <div className="text-sm md:text-base text-red-400 rounded-lg bg-red-600 px-2 py1 absolute top-0 right-0">
              -29%
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-3 text-center">Khóa học bao gồm:</h2>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center text-sm md:text-base">
                <p className="mr-2 text-white" /> 1 giờ học
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="mr-2 text-white" /> Video quay Full HD
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="mr-2 text-white" /> Có nhóm hỗ trợ
              </li>
              <li className="flex items-center text-sm md:text-base">
                <p className="mr-2 text-white" /> Tài liệu kèm theo
              </li>
            </ul>
          </div>

          <div className="text-center mb-4 md:mb-6">
            <Link href="/pay">
              <button className="bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg w-full text-sm md:text-base">
                Mua ngay
              </button>
            </Link>
          </div>

          {/* Discount Code Section */}
          <div className="mb-4 md:mb-6">
            <input
              type="text"
              placeholder="NHẬP MÃ GIẢM GIÁ"
              className="p-2 md:p-3 bg-gray-700 text-white rounded-lg w-full mb-2 md:mb-4 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-gradient-to-r from-gray-600 to-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 md:py-2 md:px-6 rounded-lg w-full text-sm md:text-base">
              Áp dụng
            </button>
          </div>

          {/* Help Link */}
          <div className="text-center text-gray-400 text-sm ">
            Bạn chưa biết cách mua khóa học?{" "}
            <a href="#" className="text-blue-400 underline">
              Nhấn vào đây nha
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
