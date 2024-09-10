"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import banner from "../../../../public/img1.avif";

export default function SuccessMessage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14 items-center">
          <span className="mp-3 text-4xl font-bold text-black text-center">
            Đặt lại mật khẩu thành công
          </span>
          <span className="font-light text-gray-400 mt-2 text-center">
            Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể quay lại
            trang đăng nhập để sử dụng mật khẩu mới.
          </span>

          <Link href="/login">
            <button className="mt-8 bg-primary text-white p-4 rounded-lg w-full shadow hover:bg-primary/90">
              Quay lại đăng nhập
            </button>
          </Link>
        </div>
        <div className="relative">
          <Image
            src={banner}
            alt="Success banner"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />
        </div>
      </div>
    </div>
  );
}
