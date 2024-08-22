export default function ProfilePage() {
  return <div className="mx-auto p-6 bg-white rounded-lg relative">
  <button className="absolute top-4 right-4 px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-600">
    Cập nhật
  </button>
  <div className="flex flex-col sm:flex-row mt-16">
  
    <div className="flex-1 pr-4 mb-4 sm:mb-0">
      <div className="mb-4">
        <div className="text-gray-700 font-bold text-lg mb-1">Tên:</div>
        <div className="p-4 border border-gray-300 rounded-lg">
          Phước Vũ
        </div>
      </div>
      <div className="mt-4"> 
        <div className="text-gray-700 font-bold text-lg mb-1">Username:</div>
        <div className="p-4 border border-gray-300 rounded-lg">
          phuocvu
        </div>
      </div>
    </div>
    
    <div className="flex-1 pl-4">
      <div className="mb-6">
        <div className="text-gray-700 font-bold text-lg mb-1">Email:</div>
        <div className="p-4 border border-gray-300 rounded-lg">
          phuocvu@example.com
        </div>
      </div>
      <div className="mt-6"> 
        <div className="text-gray-700 font-bold text-lg mb-1">Bio:</div>
        <div className="p-4 border border-gray-300 rounded-lg">
          Đây là một bio mẫu.
        </div>
      </div>
    </div>
  </div>
</div>;
}
