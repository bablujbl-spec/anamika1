import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-4">The page you are looking for doesn’t exist.</p>
      <Link
        href="/"
        className="text-blue-600 hover:underline"
      >
        Go back home
      </Link>
    </div>
  );
}
