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
    title: "Pending Invites",
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
          <div className="w-full bg-[var(--light-green)] p-5 rounded-[20px] flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[#565656] font-medium">{st?.title}</p>
              <p className="text-[24px] font-semibold">
                {st?.title === "Total Communities"
                  ? stats?.activeCommunities
                  : st?.title === "Total Members"
                  ? stats?.totalMembers
                  : st?.title === "Pending Invites"
                  ? stats?.pendingInvites
                  : st?.title === "Total Earnings"
                  ? stats?.totalEarnings
                  : 0}
              </p>
            </div>
            <div>
              <div className="w-[67px] h-[67px] bg-[var(--button-bg)] rounded-[15px] flex items-center justify-center">
                <img
                  src={st?.icon}
                  width={st?.iconWidth}
                  height={st?.iconHeight}
                  alt="icon placeholder"
                  className={``}
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
