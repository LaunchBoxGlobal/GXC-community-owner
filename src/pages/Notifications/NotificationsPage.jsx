import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Loader/Loader";

const NotificationsPage = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
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

      console.log(res?.data?.data?.notifications);

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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
      month: "short", // "Jan", "Feb", ...
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between gap-5">
        <h2 className="page-heading">Notifications</h2>
      </div>

      <div className="w-full border my-4" />

      {loading ? (
        <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
          <Loader />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
          No notifications
        </div>
      ) : (
        <ul className="overflow-y-auto">
          {notifications?.map((notif, index) => (
            <li
              key={index}
              className={`py-3 text-start border-b cursor-pointer hover:bg-gray-100 ${
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
