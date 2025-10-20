import React from "react";

export const DASHBOARD_STATS = [
  {
    title: "Total Communities",
    count: "540",
    icon: "/total-communities-icon.png",
    iconWidth: 34,
    iconHeight: 34,
  },
  {
    title: "Total Members",
    count: "540",
    icon: "/total-members-icon.png",
    iconWidth: 22,
    iconHeight: 28,
  },
  {
    title: "Active Links",
    count: "540",
    icon: "/pending-invites-icon-2.png",
    iconWidth: 33,
    iconHeight: 33,
  },
  {
    title: "Total Earnings",
    count: "540",
    icon: "/total-earnings.png",
    iconWidth: 38,
    iconHeight: 36,
  },
];

const HomePageStats = ({ stats }) => {
  return (
    <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {DASHBOARD_STATS?.map((st, i) => {
        return (
          <div className="w-full bg-[var(--light-green)] p-4 sm:p-5 rounded-[20px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* --- Left Section --- */}
            <div className="flex-1">
              <p className="text-[#565656] font-medium text-xs sm:text-sm">
                {st?.title}
              </p>
              <p className="text-lg sm:text-xl xl:text-[24px] font-semibold mt-1">
                {st?.title === "Total Communities"
                  ? stats?.activeCommunities
                  : st?.title === "Total Members"
                  ? stats?.totalMembers
                  : st?.title === "Active Links"
                  ? stats?.activeLinks
                  : st?.title === "Total Earnings"
                  ? stats?.totalEarnings
                  : 0}
              </p>
            </div>

            {/* --- Right Section (Icon Box) --- */}
            <div className="self-start sm:self-center">
              <div className="w-[55px] h-[55px] sm:w-[67px] sm:h-[67px] bg-[var(--button-bg)] rounded-[15px] flex items-center justify-center">
                <img
                  src={st?.icon}
                  width={st?.iconWidth}
                  height={st?.iconHeight}
                  alt="icon placeholder"
                  className="object-contain max-w-[70%] max-h-[70%]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePageStats;
