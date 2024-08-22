import React from "react";

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Bài viết nổi bật</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
  <div className="p-4 flex-grow">
    <div className="flex items-center mb-2">
      <img src="https://via.placeholder.com/40" alt="Lý Cao Nguyên" className="w-10 h-10 rounded-full" />
      <div className="ml-3">
        <p className="text-sm font-semibold">Lý Cao Nguyên</p>
        <p className="text-xs text-gray-500">2 tháng trước</p>
      </div>
    </div>
    <h3 className="font-semibold text-xl">Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày</h3>
    <p className="text-sm text-gray-700 mt-2">
      Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết...
    </p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-xs font-medium text-gray-500">Front-end</span>
      <span className="text-xs text-gray-500">4 phút đọc</span>
    </div>
  </div>
  <div className="w-2/5"> {/* Điều chỉnh chiều rộng tại đây */}
    <img src="https://via.placeholder.com/150" alt="Minh hoạ" className="w-full h-full object-cover" />
  </div>
</div>


<div className="bg-white rounded-lg shadow-md overflow-hidden flex">
  <div className="p-4 flex-grow">
    <div className="flex items-center mb-2">
      <img src="https://via.placeholder.com/40" alt="Lý Cao Nguyên" className="w-10 h-10 rounded-full" />
      <div className="ml-3">
        <p className="text-sm font-semibold">Lý Cao Nguyên</p>
        <p className="text-xs text-gray-500">2 tháng trước</p>
      </div>
    </div>
    <h3 className="font-semibold text-xl">Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày</h3>
    <p className="text-sm text-gray-700 mt-2">
      Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết...
    </p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-xs font-medium text-gray-500">Front-end</span>
      <span className="text-xs text-gray-500">4 phút đọc</span>
    </div>
  </div>
  <div className="w-2/5"> {/* Điều chỉnh chiều rộng tại đây */}
    <img src="https://via.placeholder.com/150" alt="Minh hoạ" className="w-full h-full object-cover" />
  </div>
</div>


<div className="bg-white rounded-lg shadow-md overflow-hidden flex">
  <div className="p-4 flex-grow">
    <div className="flex items-center mb-2">
      <img src="https://via.placeholder.com/40" alt="Lý Cao Nguyên" className="w-10 h-10 rounded-full" />
      <div className="ml-3">
        <p className="text-sm font-semibold">Lý Cao Nguyên</p>
        <p className="text-xs text-gray-500">2 tháng trước</p>
      </div>
    </div>
    <h3 className="font-semibold text-xl">Mình đã làm thế nào để hoàn thành một dự án website chỉ trong 15 ngày</h3>
    <p className="text-sm text-gray-700 mt-2">
      Xin chào mọi người mình là Lý Cao Nguyên, mình đã làm một dự án website front-end với hơn 100 bài học và 200 bài viết...
    </p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-xs font-medium text-gray-500">Front-end</span>
      <span className="text-xs text-gray-500">4 phút đọc</span>
    </div>
  </div>
  <div className="w-2/5"> {/* Điều chỉnh chiều rộng tại đây */}
    <img src="https://via.placeholder.com/150" alt="Minh hoạ" className="w-full h-full object-cover" />
  </div>
</div>

        </div>

        <aside className="mt-8">
          <h3 className="font-bold text-xl mb-4">XEM CÁC BÀI VIẾT THEO CHỦ ĐỀ</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Front-end / Mobile apps</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Back-end / Devops</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">UI / UX / Design</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Others</button>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <h4 className="font-bold text-lg">Khóa học HTML CSS PRO</h4>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Thực hành 8 dự án</li>
                <li>Hơn 300 bài tập thử thách</li>
                <li>Tặng ứng dụng Flashcards</li>
                <li>Tặng 3 Games luyện HTML CSS</li>
                <li>Tặng 20+ thiết kế trên Figma</li>
              </ul>
              <button className="mt-4 bg-red-500 py-2 px-4 rounded-lg">Tìm hiểu thêm</button>
            </div>

            <div className="bg-red-500 text-white p-4 rounded-lg">
              <h4 className="font-bold text-lg">Theo dõi kênh Youtube F8 Official</h4>
              <p className="mt-2">Vlog và cuộc sống lập trình viên</p>
              <p className="mt-2">Chia sẻ kinh nghiệm làm việc thực tế</p>
              <p className="mt-2">Hiểu con người, tính cách Founder F8</p>
              <button className="mt-4 bg-yellow-500 py-2 px-4 rounded-lg">Subscribe</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
