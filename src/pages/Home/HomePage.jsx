import { useCallback, useEffect, useState } from "react";
import HomePageStats from "./HomePageStats";
import Cookies from "js-cookie";
import CommunityCard from "../../components/Common/CommunityCard";
import { BASE_URL } from "../../data/baseUrl";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import Loader from "../../components/Loader/Loader";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PermissionModal } from "./StripeAccountPermissionModal";
import { useAppContext } from "../../context/AppContext";
import Pagination from "../../components/Common/Pagination";
import {
  listenForMessages,
  requestNotificationPermission,
} from "../../notifications";
import { enqueueSnackbar } from "notistack";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const { user } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [fetchingStats, setFetchingStats] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [createStripe, setCreateStripe] = useState(false);
  const COMMUNITIES_LIMIT = 6;

  // Clear cookies only once on mount
  useEffect(() => {
    document.title = "Dashboard - giveXchange";
    [("email", "signupEmail", "verifyEmail")].forEach((c) => Cookies.remove(c));
  }, []);

  // ---------------------------------------------
  // 🔹 Fetch Stats
  // ---------------------------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/stats/community-owner/dashboard`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setStats(res?.data?.data?.overview || []);
      } catch (error) {
        setStatsError(error.response?.data?.message || "Failed to fetch stats");
        handleApiError(error, navigate);
      } finally {
        setFetchingStats(false);
      }
    };

    fetchStats();
  }, [navigate]);

  // ---------------------------------------------
  // 🔹 Check Stripe status once
  // ---------------------------------------------
  useEffect(() => {
    const checkStripe = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res?.data?.success) setShowConfirmationModal(true);
      } catch (error) {
        if (error?.status === 404) {
          setShowConfirmationModal(true);
          return;
        }
        handleApiError(error, navigate);
      }
    };

    checkStripe();
  }, [navigate]);

  // ---------------------------------------------
  // 🔹 Fetch Communities (Memoized)
  // ---------------------------------------------
  const fetchCommunities = useCallback(
    async (query, currentPage) => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/communities/my-communities`, {
          params: {
            page: currentPage,
            limit: COMMUNITIES_LIMIT,
            ...(query && { search: query }),
          },
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const data = res.data.data;
        setCommunities(data.communities || []);
        setPagination(data.pagination);
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ---------------------------------------------
  // 🔹 Fetch when page changes
  // ---------------------------------------------
  useEffect(() => {
    fetchCommunities(searchTerm, page);
  }, [page, fetchCommunities]);

  // ---------------------------------------------
  // 🔹 Debounced search
  // ---------------------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      // always go back to page 1 when searching
      const params = new URLSearchParams();
      params.set("page", page);
      navigate(`?${params.toString()}`);

      fetchCommunities(searchTerm, page);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchCommunities, navigate]);

  // ---------------------------------------------
  // 🔹 Pagination Handler
  // ---------------------------------------------
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams();
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  // ✅ Render page numbers dynamically
  const renderPageNumbers = () => {
    if (!pagination) return null;
    const { totalPages } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            aria-current={i === page ? "page" : undefined}
            className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
              i === page
                ? "text-white bg-[var(--button-bg)] font-medium"
                : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <main className="w-full p-5 rounded-[10px] bg-white custom-shadow min-h-[78.6vh]">
      {user && (
        <h1 className="text-base font-medium text-[var(--secondary-color)]">
          Hello {user.fullName},
        </h1>
      )}
      <h2 className="text-[24px] lg:text-[32px] font-semibold leading-none">
        Welcome to giveXchange
      </h2>

      {/* Stats */}
      {fetchingStats ? (
        <div className="w-full flex justify-center pt-10">
          <Loader />
        </div>
      ) : statsError ? (
        <p className="text-red-500 mt-4">{statsError}</p>
      ) : (
        <HomePageStats stats={stats} />
      )}

      {/* Communities */}
      <div className="w-full mt-8">
        <h2 className="text-[24px] lg:text-[32px] font-semibold">
          Recent Communities
        </h2>

        {loading ? (
          <div className="w-full flex justify-center pt-10">
            <Loader />
          </div>
        ) : communities.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
            {communities.map((c, i) => (
              <CommunityCard community={c} key={i} />
            ))}
          </div>
        ) : (
          <p className="mt-5">You have not created any community yet.</p>
        )}
      </div>

      <Pagination
        pagination={pagination}
        page={page}
        handlePageChange={handlePageChange}
        renderPageNumbers={renderPageNumbers}
      />

      <PermissionModal
        handleCreateStripeAccount={async () => {
          setCreateStripe(true);
          try {
            const res = await axios.post(
              `${BASE_URL}/seller/stripe/onboarding`,
              {},
              { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            if (res?.data?.success) {
              window.open(res.data.data.url, "_blank");
            }
          } catch (error) {
            enqueueSnackbar(
              error?.message ||
                error?.responsive?.data?.message ||
                "Something went wrong. Try again.",
              { variant: "error" }
            );
          } finally {
            setCreateStripe(false);
            setShowConfirmationModal(false);
          }
        }}
        loading={createStripe}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </main>
  );
};

export default HomePage;
