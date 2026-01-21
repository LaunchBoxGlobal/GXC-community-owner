import { useEffect, useState } from "react";
import CommunitiesPage from "../Communities/CommunitiesPage";
import EditProfile from "./EditProfile";
import { useGetMyProfileQuery } from "../../services/userApi/userApi";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../components/Loader/PageLoader";
import { setUser } from "../../features/userSlice/userSlice";
import CommunitiesList from "../Home/CommunitiesList";

const UserProfilePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  const { data, error, isError, isLoading, refetch } = useGetMyProfileQuery(
    undefined,
    {
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setUser(user));
    }
  }, [data]);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  useEffect(() => {
    document.title = "My Profile - giveXchange";
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <>
      <div className="w-full rounded-[10px] bg-[var(--page-bg)]">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold leading-none">My Profile</h1>

          <div className="w-full bg-white p-5 flex items-center flex-col md:flex-row justify-between rounded-[15px] mt-5 gap-5 custom-shadow">
            <div className="w-full lg:max-w-[70%] flex items-start lg:items-center gap-3">
              <div className="">
                <img
                  className="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] lg:min-w-[116px] rounded-full object-cover object-center"
                  src={
                    user?.profilePictureUrl
                      ? user?.profilePictureUrl
                      : "/profile-icon.png"
                  }
                  alt={`${user?.fullName} profile picture`}
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-[22px] lg:text-[32px] font-semibold leading-[1]">
                  {user?.fullName}
                </h2>
                {user?.email && (
                  <p className="text-sm lg:text-base font-medium text-[#565656]">
                    {user?.email}
                  </p>
                )}
                {user?.description && (
                  <p className="text-sm lg:text-base font-medium text-[#565656]">
                    {user?.description?.slice(0, 100)}...
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-[160px]">
              <button
                type="button"
                onClick={() => togglePopup()}
                className="button px-10"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* <CommunitiesPage /> */}
        <div className="w-full rounded-[12px] bg-white custom-shadow pb-5 px-5">
          <h3 className="text-lg lg:text-[32px] font-semibold leading-none pt-5 px-4">
            Communities
          </h3>
          <CommunitiesList />
        </div>
      </div>

      <EditProfile
        togglePopup={togglePopup}
        showPopup={showPopup}
        fetchUserProfile={refetch}
        name={user?.fullName}
        email={user?.email}
        description={user?.description}
      />
    </>
  );
};

export default UserProfilePage;
