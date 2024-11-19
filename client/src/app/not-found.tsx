import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-xl">Oops! The page you're looking for doesn't exist on Uzidemy.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
