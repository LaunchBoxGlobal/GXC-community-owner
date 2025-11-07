import { useEffect, useState } from "react";
import HomePageStats from "./HomePageStats";
import RecentCommunitiesList from "./RecentCommunitiesList";
import Cookies from "js-cookie";
import CommunityCard from "../../components/Common/CommunityCard";
import { BASE_URL } from "../../data/baseUrl";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Loader/Loader";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { MdPayments } from "react-icons/md";
import { PermissionModal } from "./StripeAccountPermissionModal";

const HomePage = () => {
  if (
    Cookies.get("email") ||
    Cookies.get("signupEmail") ||
    Cookies.get("verifyEmail")
  ) {
    Cookies.remove("email");
    Cookies.remove("signupEmail");
    Cookies.remove("verifyEmail");
  }

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState(null);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [communitiesError, setCommunitiesError] = useState(null);

  const [createStripe, setCreateStripe] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleCheckStripeAccountStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res?.data?.success) {
        navigate("/");
      } else {
        setShowConfirmationModal(true);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowConfirmationModal(true);
        return;
      }
      console.log("handleCheckStripeAccountStatus error >>> ", error);
      handleApiError(error, navigate);
    }
  };

  const handleCreateStripeAccount = async () => {
    setCreateStripe(true);
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

      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
        setShowConfirmationModal(false);
      }
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setCreateStripe(false);
      setShowConfirmationModal(false);
    }
  };

  const fetchStats = async () => {
    setFetchingStats(true);
    setStatsError(null);
    try {
      const endpoint = `${BASE_URL}/stats/community-owner/dashboard`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStats(res?.data?.data?.overview || []);
    } catch (error) {
      handleApiError(error, navigate);
      setStatsError(
        error.response?.data?.message || "Failed to fetch statistics."
      );
    } finally {
      setFetchingStats(false);
    }
  };

  const fetchCommunities = async () => {
    setLoading(true);
    setCommunitiesError(null);
    try {
      const endpoint = `${BASE_URL}/communities/my-communities`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCommunities(res?.data?.data?.communities || []);
    } catch (error) {
      handleApiError(error, navigate);
      setCommunitiesError(
        error.response?.data?.message || "Failed to fetch communities."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = "giveXchange";
    fetchStats();
    fetchCommunities();
    handleCheckStripeAccountStatus();
  }, []);
  return (
    <main className="w-full p-5 rounded-[10px] bg-white custom-shadow min-h-[78.6vh]">
      <h1 className="text-base font-medium text-[var(--secondary-color)]">
        Hello John Doe,
      </h1>
      <h2 className="text-[32px] font-semibold leading-none">
        Welcome to giveXchange
      </h2>

      {fetchingStats ? (
        <div className="w-full flex justify-center pt-10">
          <Loader />
        </div>
      ) : statsError ? (
        <p className="text-red-500 mt-4">{statsError}</p>
      ) : (
        <HomePageStats stats={stats} />
      )}

      <div className="w-full mt-8">
        <h2 className="text-[32px] font-semibold leading-none">
          Recent Communities
        </h2>

        {loading ? (
          <div className="w-full flex justify-center pt-10">
            <Loader />
          </div>
        ) : communitiesError ? (
          <p className="text-red-500 mt-4">{communitiesError}</p>
        ) : communities && communities.length > 0 ? (
          <div className="w-full mt-5 lg:mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {communities.map((community, index) => (
              <CommunityCard community={community} key={index} />
            ))}
          </div>
        ) : (
          <div className="w-full mt-5">
            <p>You have not created any community yet.</p>
          </div>
        )}
      </div>

      <PermissionModal
        handleCreateStripeAccount={handleCreateStripeAccount}
        loading={createStripe}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </main>
  );
};

export default HomePage;
