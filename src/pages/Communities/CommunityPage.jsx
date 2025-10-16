import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import MemberList from "./MemberList";
import CommunityLinkCopy from "./CommunityLinkCopy";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import PageLoader from "../../components/Loader/PageLoader";
import { enqueueSnackbar } from "notistack";
import EditCommunity from "./EditCommunity";

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copyLinkPopup, setCopyLinkPopup] = useState(false);
  const [showCopyLinkPopup, setShowCopyLinkPopup] = useState(false);
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enableDisableLoading, setEnableDisableLoading] = useState(false);
  const [showEditCommunityPopup, setShowEditCommunityPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [memberCount, setMemberCount] = useState(null);

  const tabFromUrl = searchParams.get("tab") || "products";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  const fetchCommunityDetails = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_URL}/communities/${slug}/details`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCommunity(res?.data?.data);
    } catch (error) {
      console.error("Error fetching community:", error);
      setErrorMsg(
        error?.response?.data?.message ||
          "Failed to load community details. Please try again."
      );
      handleApiError(error, navigate);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityDetails();
  }, []);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, tab: activeTab });
  }, [activeTab, setSearchParams]);

  if (!slug) {
    navigate(-1);
    return;
  }

  const enableDisableCommunity = async () => {
    if (!community) return;
    const currentStatus = community.community.inviteLinkActive;

    // optimistic update
    setCommunity((prev) => ({
      ...prev,
      community: {
        ...prev.community,
        inviteLinkActive: !currentStatus,
      },
    }));

    setEnableDisableLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/communities/${community?.community?.id}/toggle-invite`,
        { inviteLinkActive: !currentStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      fetchCommunityDetails(false);
      enqueueSnackbar(
        currentStatus ? "Community link disabled" : "Community link enabled",
        { variant: "success" }
      );
    } catch (error) {
      // rollback if failed
      setCommunity((prev) => ({
        ...prev,
        community: {
          ...prev.community,
          inviteLinkActive: currentStatus,
        },
      }));
      handleApiError(error, navigate);
    } finally {
      setEnableDisableLoading(false);
    }
  };

  // --- Handle Loading ---
  if (loading) {
    return (
      <div className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  // --- Handle Error State ---
  if (errorMsg) {
    return (
      <main className="w-full bg-white custom-shadow rounded-[10px] p-7 mt-5 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-medium mb-4">{errorMsg}</p>
        <button
          type="button"
          onClick={() => fetchCommunityDetails(true)}
          className="button max-w-[180px]"
        >
          Retry
        </button>
      </main>
    );
  }

  // --- Main Content ---
  return (
    <main className="w-full p-5 rounded-[10px] bg-white custom-shadow">
      <div className="w-full flex items-center justify-between flex-col md:flex-row gap-5">
        <h2 className="page-heading whitespace-nowrap">Community</h2>
        <div className="flex items-center justify-center md:justify-end gap-3 w-full lg:w-[80%]">
          <button
            type="button"
            disabled={loading || enableDisableLoading}
            onClick={() => setShowEditCommunityPopup(true)}
            className="button px-3 md:px-5 max-w-[190px] disabled:cursor-not-allowed"
          >
            Edit Community
          </button>
          <button
            type="button"
            disabled={!community?.community?.inviteLinkActive || loading}
            onClick={() => setShowCopyLinkPopup(true)}
            className="button px-3 md:px-5 max-w-[160px] disabled:cursor-not-allowed"
          >
            Invite Members
          </button>
        </div>
      </div>

      <div className="w-full bg-white custom-shadow rounded-lg md:rounded-xl lg:rounded-[24px] p-7 mt-5 flex flex-wrap overflow-hidden items-center justify-between gap-y-5">
        <div className="w-full lg:max-w-[70%]">
          <h2 className="page-heading">{community?.community?.name}</h2>
          {community?.community?.slug && (
            <p className="text-base text-[var(--secondary-color)] leading-[1.3] mt-2 break-words">
              <span className="font-semibold">Slug: </span>
              {community?.community?.slug}
            </p>
          )}
          {community?.community?.description && (
            <p className="text-base text-[var(--secondary-color)] leading-[1.3] mt-2 break-words">
              <span className="font-semibold">Description: </span>
              {community?.community?.description}
            </p>
          )}
        </div>

        <div className="w-full lg:w-[30%] flex items-center justify-between md:justify-end flex-wrap md:gap-10">
          {community?.community?.memberCount && (
            <div className="text-center space-y-1">
              <h4>Members</h4>
              <p className="font-semibold text-[var(--primary-color)] text-[24px] leading-none">
                {community?.community?.memberCount > 0
                  ? community?.community?.memberCount
                  : 0}
              </p>
            </div>
          )}
          {community?.community?.productCount && (
            <div className="text-center space-y-1">
              <h4>Products</h4>
              <p className="font-semibold text-[var(--primary-color)] text-[24px] leading-none">
                {community?.community?.productCount || "0"}
              </p>
            </div>
          )}
          <div className="space-y-1.5 pt-1">
            <h4>
              {community?.community?.inviteLinkActive ? "Disable" : "Enable"}
            </h4>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={community?.community?.inviteLinkActive}
                disabled={enableDisableLoading}
                onChange={enableDisableCommunity}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--button-bg)]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        <div className="w-full max-w-[422px] h-[60px] bg-white custom-shadow rounded-[12px] grid grid-cols-2 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`w-full text-sm lg:text-lg font-medium rounded-[12px] ${
              activeTab === "products"
                ? "bg-[var(--button-bg)] text-white"
                : "bg-white text-black"
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`w-full text-sm lg:text-lg font-medium rounded-[12px] ${
              activeTab === "members"
                ? "bg-[var(--button-bg)] text-white"
                : "bg-white text-black"
            }`}
          >
            Members
          </button>
        </div>
      </div>

      <div className="w-full mt-6 min-h-[30vh]">
        {activeTab === "products" ? (
          <ProductList
            count={community?.community?.productCount}
            community={community?.community}
          />
        ) : (
          <MemberList
            communityId={community?.community?.id}
            count={community?.community?.memberCount}
            setMemberCount={setMemberCount}
            community={community}
          />
        )}
      </div>

      <CommunityLinkCopy
        copyLinkPopup={copyLinkPopup}
        setCopyLinkPopup={setCopyLinkPopup}
        setShowCopyLinkPopup={setShowCopyLinkPopup}
        showCopyLinkPopup={showCopyLinkPopup}
        slug={slug}
      />

      <EditCommunity
        setShowEditCommunityPopup={setShowEditCommunityPopup}
        showEditCommunityPopup={showEditCommunityPopup}
        community={community?.community}
        fetchCommunityDetails={fetchCommunityDetails}
      />
    </main>
  );
};

export default CommunityPage;
