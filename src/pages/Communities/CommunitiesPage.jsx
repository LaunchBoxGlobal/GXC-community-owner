import { LuSearch } from "react-icons/lu";
import RecentCommunitiesList from "../Home/RecentCommunitiesList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CommunitiesPage = () => {
  const [showAddCommunityPopup, setShowAddCommunityPopup] = useState(false);
  const [communityUrl, setCommunityUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const toggleCommunityPopup = () => {
    setShowAddCommunityPopup((prev) => !prev);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowAddCommunityPopup(false);
    navigate(`/communities/details/${communityUrl}`);
    Cookies.remove("slug");
  };
  return (
    <main className="w-full p-5 rounded-[10px] bg-[var(--white-bg)] custom-shadow min-h-[78vh]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        <div className="">
          <h3 className="text-[32px] font-semibold leading-none">
            Communities
          </h3>
        </div>
        {/* search & add new community */}
        <div className="w-full lg:max-w-1/2 flex justify-end gap-4">
          <div className="w-full max-w-[252px]">
            <div className="border h-[49px] px-[15px] rounded-[8px] bg-white border-[#D9D9D9] flex items-center justify-start gap-2">
              <LuSearch className="text-xl text-[var(--secondary-color)]" />
              <input
                type="text"
                placeholder="Search"
                className={`w-full outline-none disabled:cursor-not-allowed border-none`}
              />
            </div>
          </div>
          <div className="min-w-[201px]">
            <button
              type="button"
              onClick={() => toggleCommunityPopup()}
              className="button"
            >
              Add New Community
            </button>
          </div>
        </div>
      </div>
      <RecentCommunitiesList
        showAddCommunityPopup={showAddCommunityPopup}
        setShowAddCommunityPopup={setShowAddCommunityPopup}
        communityUrl={communityUrl}
        setCommunityUrl={setCommunityUrl}
        showSuccessPopup={showSuccessPopup}
        setShowSuccessPopup={setShowSuccessPopup}
        toggleCommunityPopup={toggleCommunityPopup}
        handleCloseSuccessPopup={handleCloseSuccessPopup}
      />
    </main>
  );
};

export default CommunitiesPage;
