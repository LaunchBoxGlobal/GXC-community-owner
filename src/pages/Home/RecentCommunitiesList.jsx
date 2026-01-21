import CommunityCard from "../../components/Common/CommunityCard";
import PageLoader from "../../components/Loader/PageLoader";

const RecentCommunitiesList = ({ communities, loading }) => {
  return (
    <div className="w-full">
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {communities && communities.length > 0 ? (
            <div className="w-full mt-5 lg:mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {communities.map((community, index) => (
                <CommunityCard community={community} key={index} />
              ))}
            </div>
          ) : (
            <div className="w-full mt-5 text-center pt-20">
              <p>No communities found!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentCommunitiesList;
