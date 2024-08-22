"use client";
import Link from "next/link";

import React, { useState } from 'react';

export default function Details() {
  const [couponCode, setCouponCode] = useState('');

  const handleCouponApply = () => {
    console.log('Coupon applied:', couponCode);
  };

  return (
<div className=" text-white p-4 md:p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
 
        {/* Left Side: Video Section */}
        <div className=" p-4 md:p-6 ">
          <iframe
            className="w-full h-60 md:h-80 rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <h2 className="mt-4 text-lg md:text-2xl font-bold">Minh hoạ vector bằng Adobe Illustrator cùng Rachelizmarvel</h2>
          <p className="mt-2 text-gray-400 text-sm md:text-base">
            Cùng tạo hình minh hoạ theo phong cách siêu thực dễ thương và mơ mộng với hướng dẫn chi tiết từ Rachel! Trong khóa học này, mình sẽ giữ bạn từ việc tìm ý tưởng, phác thảo, tạo hình, lên màu...
          </p>
        </div>

        {/* Right Side: Buy Section */}
        <div className="bg-gray-800 mb-11 mt-6 p-4 md:p-6 rounded-lg flex flex-col justify-center">
          
          {/* Price Section */}
          <div className="text-center mb-4 md:mb-6 flex relative ">
            <div className="text-xl  font-bold text-red-500 m-2 ">499.000 VNĐ</div>
            <div className="text-sm  text-gray-500 line-through m-2 ">699.000 VNĐ</div>
            <div className="text-sm md:text-base text-red-400 rounded-lg bg-red-600 px-2 py1 absolute top-0 right-0">-29%</div>
          </div>

          {/* Course Details */}
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
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="p-2 md:p-3 bg-gray-700 text-white rounded-lg w-full mb-2 md:mb-4 text-sm  focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleCouponApply}
              className="bg-gradient-to-r from-gray-600 to-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 md:py-2 md:px-6 rounded-lg w-full text-sm md:text-base"
            >
              Áp dụng
            </button>
          </div>

          {/* Help Link */}
          <div className="text-center text-gray-400 text-sm ">
            Bạn chưa biết cách mua khóa học? <a href="#" className="text-blue-400 underline">Nhấn vào đây nha</a>
          </div>
        </div>

      </div>
    </div>

  );
}
          