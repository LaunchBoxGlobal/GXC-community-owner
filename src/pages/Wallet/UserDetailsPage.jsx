import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../../components/Loader/PageLoader";
import { useGetMemberPublicProfileQuery } from "../../services/userApi/userApi";

const UserDetailsPage = () => {
  const params = useParams();
  const userId = params?.userId;

  const { data, error, isError, isLoading } = useGetMemberPublicProfileQuery(
    { userId },
    {
      skip: !userId,
      refetchOnReconnect: true,
    }
  );

  const member = data?.data?.user || null;

  useEffect(() => {
    document.title = "Member Details - giveXchange";
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if ((error, isError)) {
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
    <div className="w-full bg-white custom-shadow min-h-screen rounded-lg md:rounded-xl lg:rounded-[24px] p-7">
      <h2 className="text-[24px] lg:text-[32px] font-semibold">User Details</h2>
      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex items-center justify-between flex-wrap gap-6 lg:gap-0">
        <div className="w-full lg:w-[70%] flex items-start flex-col lg:flex-row lg:items-center justify-start gap-2">
          <div className="w-full flex items-center gap-2 lg:w-auto">
            <img
              className="h-[54px] min-w-[54px] lg:w-[116px] lg:h-[116px] rounded-full object-cover object-center"
              src={member?.profilePictureUrl || "/profile-icon.png"}
              alt="Profile"
            />
            <h2 className="text-[20px] lg:text-[32px] font-semibold leading-none block lg:hidden">
              {member?.firstName} {member?.lastName}
            </h2>
          </div>

          <div>
            <h2 className="text-[20px] lg:text-[32px] font-semibold leading-none hidden lg:block">
              {member?.firstName} {member?.lastName}
            </h2>
            <div className="flex items-start flex-col gap-2 lg:gap-0 gap-x-4 flex-wrap justify-start mt-2">
              {member?.email && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  {member?.email}
                </p>
              )}
              {member?.phone && (
                <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                  {member?.phone?.startsWith("+1")
                    ? member?.phone
                    : `+1${member?.phone}`}
                </p>
              )}

              <div className="w-full flex items-center gap-1 gap-y-3 flex-wrap">
                {member?.address && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.address}
                  </p>
                )}
                {member?.city && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.city}
                  </p>
                )}
                {member?.state && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.state}
                  </p>
                )}
                {member?.country && (
                  <p className="text-sm lg:text-base text-[var(--secondary-color)]">
                    {member?.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-end gap-10"></div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
