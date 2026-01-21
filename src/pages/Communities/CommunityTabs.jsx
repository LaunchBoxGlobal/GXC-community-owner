import { useSearchParams } from "react-router-dom";

const CommunityTabs = ({ activeTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // const handleTabClick = (tab) => {
  //   const currentParams = Object.fromEntries(searchParams.entries());
  //   currentParams.activeTab = tab;
  //   setSearchParams(currentParams);
  // };

  const handleTabClick = (tab) => {
    const currentParams = Object.fromEntries(searchParams.entries());

    setSearchParams({
      ...currentParams,
      activeTab: tab,
    });
  };

  return (
    <div className="w-full mt-8">
      <div className="w-full max-w-[422px] h-[60px] bg-white custom-shadow rounded-[12px] grid grid-cols-2 p-1">
        <button
          type="button"
          onClick={() => handleTabClick("products")}
          className={`w-full text-sm lg:text-lg font-medium rounded-[12px] ${
            activeTab === "products"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-white text-black"
          }`}
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => handleTabClick("members")}
          className={`w-full text-sm lg:text-lg font-medium rounded-[12px] ${
            activeTab === "members"
              ? "bg-[var(--button-bg)] text-white"
              : "bg-white text-black"
          }`}
        >
          Members
        </button>
      </div>
    </div>
  );
};

export default CommunityTabs;
