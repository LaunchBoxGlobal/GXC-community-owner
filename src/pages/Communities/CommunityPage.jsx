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
import CommunityHeader from "./CommunityHeader";
import CommunityTabs from "./CommunityTabs";

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
  const [showInvitationButton, setShowInvitationButton] = useState(false);
  const [createStripe, setCreateStripe] = useState(false);

  const handleCheckStripeAccountStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/stripe/return`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res?.data?.success) {
        setShowInvitationButton(true);
      } else {
        setShowInvitationButton(false);
      }
    } catch (error) {
      if (error?.status === 404) {
        setShowInvitationButton(false);
        return;
      }
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
      }
    } catch (error) {
      console.error("create stripe account error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setCreateStripe(false);
    }
  };

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
    document.title = "Community Details - giveXchange";
    handleCheckStripeAccountStatus();
    fetchCommunityDetails();
  }, []);

  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, activeTab: activeTab });
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

  if (loading) {
    return <PageLoader />;
  }

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
    <main className="w-full p-5 rounded-[10px] min-h-[80vh] bg-white custom-shadow">
      <CommunityHeader
        community={community}
        enableDisableCommunity={enableDisableCommunity}
        enableDisableLoading={enableDisableLoading}
        loading={loading}
        setShowEditCommunityPopup={setShowEditCommunityPopup}
        setShowCopyLinkPopup={setShowCopyLinkPopup}
        createStripe={createStripe}
        handleCreateStripeAccount={handleCreateStripeAccount}
        showInvitationButton={showInvitationButton}
      />

      {/* tabs */}

      <CommunityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
