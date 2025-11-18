import React, { useEffect } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import NotificationsPage from "../../pages/Settings/NotificationsPage";
import PaymentMethodsPage from "../../pages/Settings/PaymentMethodsPage";
import ChangePasswordPage from "../../pages/Settings/ChangePasswordPage";
import DeleteAccountPage from "../../pages/Settings/DeleteAccountPage";
import SupportPage from "../../pages/Settings/SupportPage";

const settingPages = [
  {
    title: "Notification",
    url: "/settings/notifications",
  },
  // {
  //   title: "Pyament Method",
  //   url: "/settings/payment-method",
  // },
  {
    title: "Change Password",
    url: "/settings/change-password",
  },
  {
    title: "Delete Account",
    url: "/settings/delete-account",
  },
  {
    title: "Support",
    url: "/settings/support",
  },
];

const SettingsLayout = () => {
  const location = useLocation();
  const { settingsTab } = useParams();

  useEffect(() => {
    document.title = "Settings - giveXchange";
  }, []);

  const ActivePage =
    settingsTab === "notifications" ? (
      <NotificationsPage />
    ) : settingsTab === "payment-method" ? (
      <PaymentMethodsPage />
    ) : settingsTab === "change-password" ? (
      <ChangePasswordPage />
    ) : settingsTab === "delete-account" ? (
      <DeleteAccountPage />
    ) : settingsTab === "support" ? (
      <SupportPage />
    ) : (
      ""
    );

  return (
    <div className="w-full p-5 rounded-[10px] bg-white custom-shadow">
      <h1 className="text-[32px] font-semibold leading-none">Settings</h1>
      <p className="text-[#565656] text-lg leading-none mt-4">
        Manage your account and preferences.
      </p>
      <div className="w-full min-h-screen flex flex-col lg:flex-row items-start lg:justify-between bg-white rounded-[12px] mt-6 custom-shadow">
        <div className="w-full lg:w-[25%] lg:min-h-screen border-r pt-5 overflow-hidden">
          <ul className="w-full flex lg:flex-col gap-y-2 overflow-auto">
            {settingPages?.map((link, index) => {
              return (
                <li className={`w-full text-black h-[49px]`} key={index}>
                  <Link
                    to={link?.url}
                    className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 outline-none ${
                      location?.pathname === link?.url
                        ? "lg:border-l-[4px] border-[var(--button-bg)]"
                        : " transition-all duration-300 group lg:border-l-[4px] border-[#fff]"
                    } whitespace-nowrap`}
                  >
                    <span className="">{link?.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-full lg:w-[72%] pt-5 pr-5 pl-5 lg:pl-0 pb-5">
          {ActivePage}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
