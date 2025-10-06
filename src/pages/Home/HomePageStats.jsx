import React from "react";

export const stats = [
  {
    title: "Total Communities",
    count: "540",
    icon: "/communities-icon.png",
    iconWidth: 67,
    iconHeight: 67,
  },
  {
    title: "Total Members",
    count: "540",
    icon: "/total-users-icon.png",
    iconWidth: 67,
    iconHeight: 67,
  },
  {
    title: "Pending Invites",
    count: "540",
    icon: "/pending-invites-icon.png",
    iconWidth: 67,
    iconHeight: 67,
  },
  {
    title: "Total Earnings",
    count: "540",
    icon: "/total-earnings-icon.png",
    iconWidth: 67,
    iconHeight: 67,
  },
];

const HomePageStats = () => {
  return (
    <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((st, i) => {
        return (
          <div className="w-full bg-[var(--light-green)] p-5 rounded-[20px] flex items-center justify-between gap-3">
            <div>
              <p className="text-[#565656] font-medium">{st?.title}</p>
              <p className="text-[24px] font-semibold">{st?.count}</p>
            </div>
            <div>
              <img
                src={st?.icon}
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
