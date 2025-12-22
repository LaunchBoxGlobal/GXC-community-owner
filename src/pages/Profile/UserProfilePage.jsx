import { useEffect, useState } from "react";
import CommunitiesPage from "../Communities/CommunitiesPage";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import { useAppContext } from "../../context/AppContext";
import { handleApiError } from "../../utils/handleApiError";

const UserProfilePage = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUser(res?.data?.data?.user);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    document.title = "My Profile - giveXchange";
    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="w-full rounded-[10px] bg-[var(--page-bg)]">
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold leading-none">My Profile</h1>

          <div className="w-full bg-white p-5 flex items-center flex-col md:flex-row justify-between rounded-[15px] mt-5 gap-5 custom-shadow">
            <div className="w-full lg:max-w-[70%] flex items-start lg:items-center gap-3">
              <div className="">
                <img
                  class="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] lg:min-w-[116px] rounded-full object-cover object-center"
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

        <CommunitiesPage />
      </div>

      <EditProfile
        togglePopup={togglePopup}
        showPopup={showPopup}
        fetchUserProfile={fetchUserProfile}
        name={user?.fullName}
        email={user?.email}
        description={user?.description}
      />
    </>
  );
};

export default UserProfilePage;
