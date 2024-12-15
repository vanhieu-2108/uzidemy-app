"use client";
import Image from "next/image";
import React from "react";
import image from "../../../../../public/cer.png";
import { Playball } from "next/font/google";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";

const allura = Playball({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const handleDownload = () => {
    const element = document.getElementById("certificate");

    // Sử dụng html-to-image để tạo ảnh từ phần tử HTML
    if (element) {
      htmlToImage
        .toPng(element)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.download = "certificate.png"; // Tên file ảnh
          link.href = dataUrl;
          link.click(); // Tải ảnh xuống
        })
        .catch(function (error) {
          console.error("Có lỗi khi tạo ảnh: ", error);
        });
    } else {
      console.error("Element not found");
    }
  };

  return (
    <div className="py-10">
      <div>
        <h1 className="text-3xl font-bold text-left text-gray-900">Nhận chứng chỉ</h1>
        <p className="mt-2 text-sm text-gray-800 py-5">
          Uzidemy ghi nhận sự nỗ lực của bạn! Bằng cách nhận chứng chỉ này, bạn chính thức hoàn thành khóa học
          <span className="font-bold ml-1">JavaScript</span>
        </p>
        <div id="certificate" className="relative">
          <Image src={image} alt="cer" className="w-full object-cover" />
          <p
            className={`z-10 text-cyan-700 top-[48%] absolute left-[50%] text-md md:text-3xl lg:text-3xl -translate-x-1/2 ${allura.className}`}
          >
            HUỲNH CÔNG TRÌNH
          </p>
          <p
            className={`z-10 text-cyan-700 top-[62%] absolute left-[50%] text-sm md:text-md lg:text-xl -translate-x-1/2`}
          >
            JavaScript
          </p>
          <p className={`z-10 text-gray-600 top-[75%] absolute left-[29%] text-sm -translate-x-1/2`}>
            Da Nang, 05 Dec 2024
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button className="mt-2" onClick={handleDownload}>
          Tải xuống
        </Button>
      </div>
    </div>
  );
}
