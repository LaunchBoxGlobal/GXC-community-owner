import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Loader/Loader";

const NotificationsPage = () => {
  // Removed unused 'open' state
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/user/get-notifications?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = res.data?.data?.notifications || [];

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load notifications. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Notifications - giveXchange";
    fetchNotifications();
  }, []);

  const formatDateTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const ErrorUI = ({ message, onRetry }) => (
    <div className="p-8 text-center bg-red-50 border border-red-300 rounded-lg min-h-[80vh] flex flex-col items-center justify-center">
      {/* <p className="text-red-700 text-lg font-semibold mb-3">
        Error Loading Notifications
      </p> */}
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {/* <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
      >
        Try Again
      </button> */}
    </div>
  );

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between gap-5">
        <h2 className="page-heading">Notifications</h2>
      </div>
      <div className="w-full border mt-4 mb-2" />
      {loading ? (
        <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <ErrorUI message={error} onRetry={fetchNotifications} />
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
          No notifications
        </div>
      ) : (
        <ul className="overflow-y-auto">
          {notifications?.map((notif, index) => (
            <li
              key={index}
              className={`p-3 text-start border-b cursor-pointer hover:bg-gray-100 ${
                !notif.is_read ? "bg-gray-50 font-medium" : "bg-white"
              }`}
            >
              <p className="text-sm">{notif.body}</p>
              <span className="block text-xs text-gray-400 mt-1">
                {formatDateTime(notif?.created_at) || "Just now"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
