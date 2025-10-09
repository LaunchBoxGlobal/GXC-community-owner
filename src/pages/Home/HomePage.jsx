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

  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState(null);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [stats, setStats] = useState(null);

  console.log(stats);

  const fetchStats = async () => {
    setFetchingStats(true);
    try {
      const endpoint = `${BASE_URL}/stats/community-owner/dashboard`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setStats(res?.data?.data?.overview || []);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setFetchingStats(false);
    }
  };

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/communities/my-communities`;

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      setCommunities(res?.data?.data?.communities || []);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "GiveXChange";
    fetchStats();
    fetchCommunities();
  }, []);
  return (
    <main className="w-full p-5 rounded-[10px] bg-white custom-shadow min-h-[78.6vh]">
      <h1 className="text-base font-medium text-[var(--secondary-color)]">
        Hello John Doe,
      </h1>
      <h2 className="text-[32px] font-semibold leading-none">
        Welcome to Give X Change
      </h2>

      {fetchingStats ? (
        <div className="w-full flex justify-center pt-10">
          <Loader />
        </div>
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
        ) : (
          <>
            {communities && communities.length > 0 ? (
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
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
