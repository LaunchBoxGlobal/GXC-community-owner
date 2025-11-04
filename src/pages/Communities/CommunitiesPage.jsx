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
import Loader from "../../components/Loader/Loader";

const CommunitiesPage = () => {
  const [showAddCommunityPopup, setShowAddCommunityPopup] = useState(false);
  const [communityUrl, setCommunityUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkStripeAccountStatus, setCheckStripeAccountStatus] =
    useState(false);

  const handleCreateStripeAccount = async () => {
    setCheckStripeAccountStatus(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/stripe/onboarding`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log("onboarding res >>> ", res?.data);
      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
      }
      // handleCheckStripeAccountStatus();

      //   console.log("create stripe account >>> ", res?.data);
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setCheckStripeAccountStatus(false);
    }
  };

  const handleCheckStripeAccountStatus = async () => {
    setCheckStripeAccountStatus(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (res?.data?.success) {
        setShowAddCommunityPopup((prev) => !prev);
      } else {
        handleCreateStripeAccount();
      }
    } catch (error) {
      console.log("handleCheckStripeAccountStatus error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setCheckStripeAccountStatus(false);
    }
  };

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
        <div className="lg:pt-4">
          <h3 className="text-[32px] font-semibold leading-none">
            Communities
          </h3>
        </div>

        {/* search & add new community */}
        <div className="w-full lg:max-w-1/2 flex flex-wrap mt-5 justify-end gap-4">
          <div className="w-full md:max-w-[252px]">
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
              disabled={checkStripeAccountStatus}
              onClick={handleCheckStripeAccountStatus}
              className="button"
            >
              {checkStripeAccountStatus ? <Loader /> : "Add New Community"}
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
