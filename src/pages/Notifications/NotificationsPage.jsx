import { useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { formatDateTime } from "../../utils/formateDateTime";
import { useGetNotificationsQuery } from "../../services/notificationsApi/notificationsApi";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";

const NotificationsPage = () => {
  const LIMIT = 15;
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { data, error, isError, isLoading } = useGetNotificationsQuery(
    {
      page: page,
      limit: LIMIT,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const notifications = data?.data?.notifications || [];
  const pagination = data?.data?.pagination || null;

  useEffect(() => {
    document.title = "Notifications - giveXchange";
  }, []);

  if (error || isError) {
    return (
      <div className="w-full min-h-[80vh] relative flex items-center justify-center bg-white rounded-[12px] custom-shadow">
        <p className="text-gray-500 text-sm">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white p-5 lg:p-7 rounded-[12px] min-h-[80vh] lg:rounded-[24px] custom-shadow">
      <div className="w-full relative flex items-center justify-between gap-5">
        <h2 className="page-heading">Notifications</h2>
      </div>

      <div className="w-full border mt-4 mb-2" />

      {isLoading ? (
        <div className="p-4 text-center text-gray-500 text-sm min-h-[320px] flex items-center justify-center">
          <Loader />
        </div>
      ) : notifications.length === 0 ? (
        <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
          <p className="mt-5 text-sm font-medium text-gray-500">
            No notifications found.
          </p>
        </div>
      ) : (
        <div className="w-full min-h-screen">
          <ul className="overflow-y-auto">
            {notifications?.map((notif, index) => (
              <li
                key={index}
                className={`p-3 text-start border-b ${
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
        </div>
      )}

      <Pagination page={page} pagination={pagination} />
    </div>
  );
};

export default NotificationsPage;
