import React from "react";

export const stats = [
  {
    title: "Total Communities",
    count: "540",
    icon: "",
    iconWidth: "",
    iconHeight: "",
  },
  {
    title: "Total Members",
    count: "540",
    icon: "",
    iconWidth: "",
    iconHeight: "",
  },
  {
    title: "Pending Invites",
    count: "540",
    icon: "",
    iconWidth: "",
    iconHeight: "",
  },
  {
    title: "Total Earnings",
    count: "540",
    icon: "",
    iconWidth: "",
    iconHeight: "",
  },
];

const HomePageStats = () => {
  return (
    <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((st, i) => {
        return (
          <div className="w-full bg-white p-5 rounded-[20px] flex items-center justify-between gap-3">
            <div>
              <p className="text-[#565656] font-medium">{st?.title}</p>
              <p className="text-[24px] font-semibold">{st?.count}</p>
            </div>
            <div>
              <img
                src="/stats-card-icon-placeholder.png"
                alt="icon placeholder"
                className="w-[67px] h-[67px]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePageStats;
