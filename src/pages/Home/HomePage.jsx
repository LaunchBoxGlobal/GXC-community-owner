import { useEffect } from "react";
import HomePageStats from "./HomePageStats";
import RecentCommunitiesList from "./RecentCommunitiesList";
import Cookies from "js-cookie";

const HomePage = () => {
  if (
    Cookies.get("email") ||
    Cookies.get("signupEmail") ||
    Cookies.get("verifyEmail")
  ) {
    Cookies.remove("email");
    Cookies.remove("signupEmail");
    Cookies.remove("verifyEmail");
  }

  useEffect(() => {
    document.title = "GiveXChange";
  }, []);
  return (
    <main className="w-full p-5 rounded-[10px] bg-white custom-shadow min-h-[78.6vh]">
      <h1 className="text-base font-medium text-[var(--secondary-color)]">
        Hello John Doe,
      </h1>
      <h2 className="text-[32px] font-semibold leading-none">
        Welcome to Give X Change
      </h2>

      <HomePageStats />

      <div className="w-full mt-8">
        <h2 className="text-[32px] font-semibold leading-none">
          Recent Communities
        </h2>
        <RecentCommunitiesList />
      </div>
    </main>
  );
};

export default HomePage;
