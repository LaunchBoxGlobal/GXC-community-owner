import { useEffect, useState } from "react";
import CommunitiesPage from "../Communities/CommunitiesPage";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useNavigate } from "react-router-dom";
import EditProfile from "./EditProfile";
import { useAppContext } from "../../context/AppContext";

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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 401:
            console.error("Unauthorized: Token expired or invalid.");
            localStorage.removeItem("token");
            navigate("/login");
            break;

          case 403:
            console.error("Forbidden: You do not have access.");
            break;

          case 404:
            console.error("Profile not found.");
            break;

          case 500:
            console.error("Server error. Please try again later.");
            break;

          default:
            console.error(
              `Unexpected error: ${status} - ${
                error.response?.data?.message || error.message
              }`
            );
        }
      } else {
        console.error("Network or unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <>
      <div className="w-full rounded-[10px] bg-[var(--page-bg)]">
        <div className="p-5">
          <h1 className="text-[32px] font-semibold leading-none">My Profile</h1>

          <div className="w-full bg-white p-5 flex items-center justify-between flex-wrap rounded-[15px] mt-5 gap-5">
            <div className="w-full lg:max-w-[70%] flex items-start lg:items-center gap-3">
              <div className="">
                {user?.profilePictureUrl ? (
                  <img
                    class="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] rounded-full object-cover object-center"
                    src={user?.profilePictureUrl}
                    alt="user profile picture"
                  />
                ) : (
                  <img
                    class="lg:h-[116px] min-w-[54px] h-[54px] lg:max-w-[116px] rounded-full object-cover object-center"
                    src={"/profile-icon.png"}
                    alt="user profile picture"
                  />
                )}
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

            <div className="">
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
