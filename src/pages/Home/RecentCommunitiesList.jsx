import CommunityCard from "../../components/Common/CommunityCard";

const RecentCommunitiesList = () => {
  return (
    <div className="w-full">
      <h3 className="text-[32px] font-semibold leading-none">
        Recent Communities
      </h3>

      <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
        <CommunityCard />
      </div>
    </div>
  );
};

export default RecentCommunitiesList;
