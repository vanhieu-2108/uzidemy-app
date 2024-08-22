import Link from "next/link";

export default function Page() {
  return (
    <div className="p-8">
      <div className="font-bold text-5xl mb-6">Khám phá</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://evonhub.dev/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F3779a16e-0a2e-4b74-9dac-bb38a74f5fb3-e841xn.png&w=640&q=75"
            alt="Minh hoạ vector bằng Adobe Illustrator cùng Rachelizmarvel"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-2xl">
              Minh hoạ vector bằng Adobe Illustrator cùng Rachelizmarvel
            </h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <span className="text-gray-500 text-lg flex items-center mr-4 font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  5.0
                </span>
                <span className="text-gray-500 text-lg flex items-center font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  1446
                </span>
              </div>
              <span className="text-red-500 text-lg font-bold">499.000</span>
            </div>
            <Link href={`/details/`}>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded text-lg font-bold">
                Xem chi tiết
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
