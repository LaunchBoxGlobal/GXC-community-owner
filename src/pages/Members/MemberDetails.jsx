import { useEffect } from "react";
import { useParams } from "react-router-dom";

import PageLoader from "../../components/Loader/PageLoader";
import ProductCard from "../../components/Common/ProductCard";
import SuspendUuserButton from "./SuspendUuserButton";
import { useGetMemberQuery } from "../../services/userApi/userApi";

const MemberDetails = () => {
  const params = useParams();

  const communityId = params?.communityId;
  const userId = params?.userId;

  const { data, error, isError, isLoading, refetch } = useGetMemberQuery(
    { communityId, userId },
    {
      skip: !userId,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const member = data?.data || null;

  useEffect(() => {
    document.title = "Member Details - giveXchange";
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[90vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error || isError) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">
          {error?.data?.message || "Something went wrong."}
        </p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500">No member details found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[27px] p-7 min-h-screen">
      <h2 className="text-[24px] lg:text-[32px] font-semibold leading-none">
        User Details
      </h2>
      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex items-center justify-between flex-wrap gap-6 lg:gap-0">
        <div className="w-full lg:w-[70%] flex items-center gap-2">
          <div>
            <img
              className="min-h-[84px] min-w-[84px] lg:min-w-[116px] lg:h-[116px] rounded-full object-cover object-center"
              src={member?.member?.profilePictureUrl || "/profile-icon.png"}
              alt="Profile"
            />
          </div>

          <div>
            <h2 className="text-[27px] lg:text-[32px] font-semibold leading-none">
              {member?.member?.firstName} {member?.member?.lastName}
            </h2>

            <div className="flex items-center gap-x-4 flex-wrap justify-start mt-2">
              {member?.member?.email && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  {member?.member?.email}
                </p>
              )}
              {member?.member?.phone && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  {member?.member?.phone.startsWith("+")
                    ? member?.member?.phone
                    : `+${member?.member?.phone}`}
                </p>
              )}

              <div className="w-full flex items-center gap-1 gap-y-3 flex-wrap">
                {member?.member?.address && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.address}
                  </p>
                )}
                {member?.member?.city && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.city}
                  </p>
                )}
                {member?.member?.state && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.state}
                  </p>
                )}
                {member?.member?.country && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.member?.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-end gap-10">
          {/* Add future actions here */}
          <SuspendUuserButton
            member={member}
            communityId={params?.communityId}
            fetchMemberDetails={refetch}
          />
        </div>
      </div>

      {member && member?.productsListed?.length > 0 ? (
        <div className="w-full mt-10">
          <div className="w-full">
            <h2 className="page-heading">Products</h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
              {member?.productsListed?.map((product, index) => {
                return <ProductCard product={product} key={index} />;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-10">
          <div className="w-full">
            <h2 className="page-heading">Products</h2>

            <div className="w-full text-center pt-20">
              <p className="text-sm font-medium text-gray-700">
                No products found!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;
