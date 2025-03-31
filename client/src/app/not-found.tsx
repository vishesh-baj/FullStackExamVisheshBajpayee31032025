import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-5">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
