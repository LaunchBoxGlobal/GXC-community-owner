import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[var(--light-bg)] px-4">
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-3">
        <div className="relative">
          <h1 className="text-[120px] font-extrabold leading-none text-gray-200 select-none">
            404
          </h1>
          <p className="flex items-center justify-center text-[28px] font-semibold text-gray-800 mt-3">
            Page Not Found
          </p>
        </div>

        <p className="text-gray-500 max-w-md mx-auto text-base leading-[1.3] mt-2">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link to="/" className="button px-6 py-3 rounded-lg font-medium">
            Go to Dashboard
          </Link>

          <Link
            to={-1}
            className="lg:w-full px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Back
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
