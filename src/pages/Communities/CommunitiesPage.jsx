import { LuSearch } from "react-icons/lu";
import RecentCommunitiesList from "../Home/RecentCommunitiesList";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { IoClose } from "react-icons/io5";
import Loader from "../../components/Loader/Loader";
import { PermissionModal } from "../Home/StripeAccountPermissionModal";
import Pagination from "../../components/Common/Pagination";
import { enqueueSnackbar } from "notistack";

const CommunitiesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const LIMIT = 9;

  const [communities, setCommunities] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCommunityPopup, setShowAddCommunityPopup] = useState(false);
  const [communityUrl, setCommunityUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [checkStripeAccountStatus, setCheckStripeAccountStatus] =
    useState(false);
  const [createStripe, setCreateStripe] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const firstRender = useRef(true);

  // ---------------------------------------------
  // 🔹 Fetch Communities
  // ---------------------------------------------
  const fetchCommunities = useCallback(
    async (query = "", currentPage = page) => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/communities/my-communities`, {
          params: {
            page: currentPage,
            limit: LIMIT,
            ...(query && { search: query }),
          },
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const data = res?.data?.data || {};
        setCommunities(data.communities || []);
        setPagination(data.pagination);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // ---------------------------------------------
  // ✅ Initial fetch on mount or page change
  // ---------------------------------------------
  useEffect(() => {
    document.title = "Communities - giveXchange";
    fetchCommunities(searchTerm, page);
  }, [page, fetchCommunities]);

  // ---------------------------------------------
  // ✅ Debounced search
  // ---------------------------------------------
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // skip debounce on first render
    }

    const timeout = setTimeout(() => {
      fetchCommunities(searchTerm, 1); // always reset to page 1 on search
      const params = new URLSearchParams();
      params.set("page", 1);
      navigate(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchCommunities, navigate]);

  // ---------------------------------------------
  // ✅ Pagination handler
  // ---------------------------------------------
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams();
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  // ---------------------------------------------
  // ✅ Stripe onboarding handlers
  // ---------------------------------------------
  const handleCreateStripeAccount = async () => {
    setCreateStripe(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/stripe/onboarding`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (res?.data?.success && res?.data?.data?.url) {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setCreateStripe(false);
      setShowConfirmationModal(false);
    }
  };

  const handleCheckStripeAccountStatus = async () => {
    setCheckStripeAccountStatus(true);
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res?.data?.data?.accountStatus === "active") {
        setShowAddCommunityPopup(true);
      } else if (res?.data?.data?.accountStatus === "not_connected") {
        setShowConfirmationModal(true);
      } else if (res?.data?.data?.accountStatus === "pending") {
        setShowConfirmationModal(true);
        // enqueueSnackbar(
        //   "Your stripe account is pending for approval. Please wait until the acount is approved",
        //   { variant: "error" }
        // );
      }
      // else if (
      //   res?.data?.data?.accountStatus === "restricted" ||
      //   res?.data?.data?.accountStatus === "disabled"
      // ) {
      //   enqueueSnackbar(
      //     `Your stripe account is ${
      //       res?.data?.data?.accountStatus === "restricted"
      //         ? "restricted."
      //         : res?.data?.data?.accountStatus === "disabled"
      //         ? "disabled."
      //         : "incomplete."
      //     }`,
      //     { variant: "error" }
      //   );
      // }
      else {
        enqueueSnackbar("Something went wrong. Try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      if (error?.status === 404) setShowConfirmationModal(true);
      handleApiError(error, navigate);
    } finally {
      setCheckStripeAccountStatus(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowAddCommunityPopup(false);
    if (communityUrl) navigate(`/communities/details/${communityUrl}`);
    Cookies.remove("slug");
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
            } text-sm`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };

  return (
    <main className="w-full p-5 rounded-[10px] bg-[var(--white-bg)] custom-shadow min-h-[78vh]">
      {/* Header */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        <h3 className="text-[24px] lg:text-[32px] font-semibold leading-none">
          Communities
        </h3>

        <div className="w-full lg:max-w-1/2 flex flex-wrap mt-5 lg:mt-0 justify-end gap-4">
          {/* Search input */}
          <div className="w-full md:max-w-[252px]">
            <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white flex items-center gap-2 custom-shadow">
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

          {/* Add new community button */}
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

      {/* Community list */}
      <RecentCommunitiesList
        showAddCommunityPopup={showAddCommunityPopup}
        setShowAddCommunityPopup={setShowAddCommunityPopup}
        communityUrl={communityUrl}
        setCommunityUrl={setCommunityUrl}
        showSuccessPopup={showSuccessPopup}
        setShowSuccessPopup={setShowSuccessPopup}
        toggleCommunityPopup={() => setShowAddCommunityPopup((prev) => !prev)}
        handleCloseSuccessPopup={handleCloseSuccessPopup}
        loading={loading}
        total={total}
        communities={communities}
        setCommunities={setCommunities}
      />

      <Pagination
        handlePageChange={handlePageChange}
        renderPageNumbers={renderPageNumbers}
        pagination={pagination}
        page={page}
      />

      {/* Stripe permission modal */}
      <PermissionModal
        handleCreateStripeAccount={handleCreateStripeAccount}
        loading={createStripe}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />
    </main>
  );
};

export default CommunitiesPage;
