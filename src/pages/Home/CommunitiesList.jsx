import { useSearchParams } from "react-router-dom";
import CommunityCard from "../../components/Common/CommunityCard";
import Pagination from "../../components/Common/Pagination";
import { useGetMyCommunitiesQuery } from "../../services/communityApi/communityApi";
import Loader from "../../components/Loader/Loader";

const CommunitiesList = ({ limit }) => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";

  const { data: communitiesRes, isLoading } = useGetMyCommunitiesQuery(
    {
      page: searchTerm ? 1 : page,
      limit,
      search: searchTerm,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const communities = communitiesRes?.data?.communities || [];
  const paginationData = communitiesRes?.data?.pagination || null;

  return (
    <div className="w-full relative">
      <div className="w-full">
        {isLoading ? (
          <div className="w-full flex justify-center py-10">
            <Loader />
          </div>
        ) : communities.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
            {communities.map((c, i) => (
              <CommunityCard community={c} key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="w-full text-center min-h-[60vh] flex flex-col justify-center items-center px-4">
              {searchTerm ? (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  No communities found for the search term "{searchTerm}".
                </p>
              ) : (
                <p className="mt-5 text-sm font-medium text-gray-500">
                  You have not created any community yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Pagination pagination={paginationData} page={page} />
    </div>
  );
};

export default CommunitiesList;
