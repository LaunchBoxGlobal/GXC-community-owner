import HomePageStats from "./HomePageStats";
import RecentCommunitiesList from "./RecentCommunitiesList";

const HomePage = () => {
  return (
    <main className="w-full p-5 rounded-[10px] bg-[var(--page-bg)]">
      <h1 className="text-base font-medium text-[var(--secondary-color)]">
        Hello John Doe,
      </h1>
      <h2 className="text-[32px] font-semibold leading-none">
        Welcome to Give X Change
      </h2>

      <HomePageStats />

      <div className="w-full mt-8">
        <RecentCommunitiesList />
      </div>
    </main>
  );
};

export default HomePage;
