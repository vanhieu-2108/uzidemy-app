import { useRouter } from "next/router";

const BlogDetailPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tiêu đề bài viết */}
      <h1 className="text-4xl font-bold mb-6 leading-tight">
        Config Zsh bằng Oh-my-zsh và P10k trên WSL cực ngầu ✨
      </h1>

      {/* Thông tin tác giả */}
      <div className="flex items-center mb-8">
        <img
          src="https://via.placeholder.com/48"
          alt="Tác giả"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <p className="font-semibold text-lg">Evich Tran</p>
          <p className="text-sm text-gray-500">8 tháng trước • 4 phút đọc</p>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <article className="prose prose-lg max-w-none">
        <p>
          Hello anh em, thì như blog trước mình có nói rằng mình không có dùng Ubuntu, nhưng sao lại có blog này? 🤔
        </p>
        <p>
          À thì mình mới cài lại Win 10, vì máy mình cũng yếu 😏, mà không có tiền mua nên mình đã cài lùi về Win10 xài cho nó sướng nha. Chứ đừng có nói mình bị thành người "tối cổ" nha 😤.
        </p>
        <h2>I. Giới thiệu sơ lược</h2>
        <p>
          Lại nói về trước đó nữa, mình đã tu luyện thành pháp sư WSL nhưng vì Win11 mình cài nó cứ lag và cấu hình không hợp nên mình có thành tài cũng đến Tết Công Gô mới cài nổi. ...
        </p>
      </article>

      {/* Hình minh họa */}
      <div className="mt-8">
        <img
          src="https://via.placeholder.com/800x400"
          alt="Hình minh họa"
          className="w-full rounded-lg shadow-md"
        />
      </div>

      {/* Tương tác */}
      <div className="flex items-center mt-8 space-x-4 text-gray-600">
        <span>❤️ 7</span>
        <span>💬 1</span>
      </div>
    </div>
  );
};

export default BlogDetailPage;
