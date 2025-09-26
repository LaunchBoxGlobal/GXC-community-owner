import React from "react";
import { Link, useLocation } from "react-router-dom";

const settingPages = [
  {
    title: "Notification",
    url: "/settings/notifications",
  },
  {
    title: "Pyament Method",
    url: "/settings/payment-method",
  },
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

const SettingsLayout = ({ page }) => {
  const location = useLocation();
  return (
    <div className="w-full p-5 rounded-[10px] bg-[var(--page-bg)]">
      <h1 className="text-[32px] font-semibold leading-none">Settings</h1>
      <p className="text-[#565656] text-lg leading-none mt-4">
        Manage your account and preference{" "}
      </p>
      <div className="w-full min-h-screen flex items-start justify-between bg-white rounded-[12px] mt-6">
        <div className="w-[25%] min-h-screen border-r pt-5">
          <ul className="w-full flex flex-col gap-y-2">
            {settingPages?.map((link, index) => {
              return (
                <li className={`w-full text-black h-[49px]`} key={index}>
                  <Link
                    to={link?.url}
                    className={`text-sm flex items-center gap-x-2.5 font-medium w-full h-[49px] px-4 outline-none ${
                      location?.pathname === link?.url
                        ? "border-l-[4px] border-black"
                        : " transition-all duration-300 group"
                    }`}
                  >
                    <span className="">{link?.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="w-[72%] pt-5 pr-5 pb-5">{page}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
