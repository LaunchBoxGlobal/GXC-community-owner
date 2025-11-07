import { RxDashboard } from "react-icons/rx";
import { LuUsersRound } from "react-icons/lu";
import { AiOutlineUser } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { TbLayersLinked } from "react-icons/tb";
import { IoWalletOutline } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";

export const PAGE_LINKS = [
  {
    title: "Dashboard",
    page: "/",
    icon: "/communities-sidebar-icon.png",
    iconWidth: 20,
    iconHeight: 20,
    iconAltTag: "",
  },
  {
    title: "Communities",
    page: "/communities",
    icon: "/communities-sidebar-icon.png",
    iconWidth: 20,
    iconHeight: 20,
    iconAltTag: "communities-sidebar-icon",
  },
  // {
  //   title: "Members",
  //   page: "/members",
  //   icon: "/members-icon.png",
  //   iconWidth: 12,
  //   iconHeight: 15,
  //   iconAltTag: "members-icon",
  // },
  // {
  //   title: "Invites",
  //   page: "/invites",
  //   icon: "/members-sidebar-icon.png",
  //   iconWidth: 18,
  //   iconHeight: 18,
  //   iconAltTag: "invites icons",
  // },
  {
    title: "Reports",
    page: "/reports",
    icon: "/reports-icon.png",
    iconWidth: 18,
    iconHeight: 18,
    iconAltTag: "reports",
  },
  {
    title: "Transaction History",
    page: "/transaction-history",
    icon: "/wallet-icon.png",
    iconWidth: 17,
    iconHeight: 17,
    iconAltTag: "wallet icon",
  },
  {
    title: "Settings",
    page: "/settings",
    icon: "/settings-icon.png",
    iconWidth: 17,
    iconHeight: 18,
    iconAltTag: "settings icon",
  },
];
