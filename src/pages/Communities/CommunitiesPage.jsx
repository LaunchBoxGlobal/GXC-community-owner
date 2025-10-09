import { LuSearch } from "react-icons/lu";
import RecentCommunitiesList from "../Home/RecentCommunitiesList";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { IoClose } from "react-icons/io5";

const CommunitiesPage = () => {
  const [showAddCommunityPopup, setShowAddCommunityPopup] = useState(false);
  const [communityUrl, setCommunityUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCommunities = async (query = "") => {
    setLoading(true);
    try {
      const endpoint = query
        ? `${BASE_URL}/communities/my-communities?search=${encodeURIComponent(
            query
          )}`
        : `${BASE_URL}/communities/my-communities`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setCommunities(res?.data?.data?.communities || []);
      setTotal(res?.data?.data?.pagination?.total || 0);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCommunities(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const toggleCommunityPopup = () => {
    setShowAddCommunityPopup((prev) => !prev);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowAddCommunityPopup(false);
    navigate(`/communities/details/${communityUrl}`);
    Cookies.remove("slug");
  };

  // 🔹 Initial fetch
  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <main className="w-full p-5 rounded-[10px] bg-[var(--white-bg)] custom-shadow min-h-[78vh]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        <div>
          <h3 className="text-[32px] font-semibold leading-none">
            Communities
          </h3>
        </div>

        {/* search & add new community */}
        <div className="w-full lg:max-w-1/2 flex justify-end gap-4">
          <div className="w-full max-w-[252px]">
            <div className="border h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white border-[#D9D9D9] flex items-center justify-start gap-2">
              <LuSearch className="text-xl text-[var(--secondary-color)]" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none border-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="bg-gray-100 w-4 h-4 rounded-full"
                >
                  <IoClose className="text-gray-500 text-sm" />
                </button>
              )}
            </div>
          </div>
          <div className="min-w-[201px]">
            <button
              type="button"
              onClick={toggleCommunityPopup}
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
        // fetchCommunities={fetchCommunities}
        loading={loading}
        setLoading={setLoading}
        total={total}
        setTotal={setTotal}
        communities={communities}
        setCommunities={setCommunities}
      />
    </main>
  );
};

export default CommunitiesPage;
