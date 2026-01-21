import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import {
  useGetMyProfileQuery,
  useToggleNotificationSettingsMutation,
} from "../../services/userApi/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/userSlice/userSlice";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [updatingField, setUpdatingField] = useState(null);
  const { data, refetch } = useGetMyProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [toggleNotificationSettings, { isLoading }] =
    useToggleNotificationSettingsMutation();

  const handleToggle = async (field) => {
    if (!user) return;

    try {
      setUpdatingField(field);

      const res = await toggleNotificationSettings({
        [field]: !user[field],
      }).unwrap();

      dispatch(setUser(res.data.user));

      enqueueSnackbar("Preferences updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingField(null);
    }
  };

  const prodAlert = !!user?.prodAlert;
  const orderAlert = !!user?.orderNotify;

  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">Notifications</h2>
      <div className="w-full border my-5" />

      <div className="w-full space-y-4">
        {/* Product Alerts */}
        <div className="w-full bg-[#F5F5F5] rounded-[12px] p-5 flex items-center justify-between">
          <div className="w-full max-w-[80%]">
            <h3 className="font-semibold text-lg leading-none">
              New Product Alerts
            </h3>
            <p className="leading-none mt-2">
              Receive instant alerts for newly listed products.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={prodAlert}
              disabled={updatingField === "prodAlert"}
              onChange={() => handleToggle("prodAlert")}
              className="sr-only peer"
            />

            <div
              className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full 
                peer peer-checked:bg-[var(--button-bg)]
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full"
            />
          </label>
        </div>

        {/* Order Alerts */}
        <div className="w-full bg-[#F5F5F5] rounded-[12px] p-5 flex items-center justify-between">
          <div className="w-full max-w-[80%]">
            <h3 className="font-semibold text-lg leading-none">
              Order Updates
            </h3>
            <p className="leading-none mt-2">
              Stay informed about order confirmations, shipments, and
              deliveries.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={orderAlert}
              disabled={updatingField === "orderAlert"}
              onChange={() => handleToggle("orderNotify")}
              className="sr-only peer"
            />

            <div
              className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full 
                peer peer-checked:bg-[var(--button-bg)]
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-full"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
