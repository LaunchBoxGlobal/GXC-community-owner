import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/Loader/Loader";
import { PermissionModal } from "../Home/StripeAccountPermissionModal";
import { enqueueSnackbar } from "notistack";
import AddCommunity from "./AddCommunity";
import CommunitySuccessPopup from "./CommunitySuccessPopup";
import CommunitiesList from "../Home/CommunitiesList";
import SearchField from "../../components/Common/SearchField";
import {
  useLazyCheckStripeStatusQuery,
  useCreateStripeAccountMutation,
} from "../../services/userApi/userApi";

const CommunitiesPage = () => {
  const navigate = useNavigate();
  const [showAddCommunityPopup, setShowAddCommunityPopup] = useState(false);
  const [communityUrl, setCommunityUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    document.title = "Communities - giveXchange";
  }, []);

  const [createStripeAccount, { isLoading: createStripe }] =
    useCreateStripeAccountMutation();

  const handleCreateStripeAccount = async () => {
    try {
      const res = await createStripeAccount().unwrap();

      if (res?.success && res?.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      enqueueSnackbar(
        error?.data?.message || "Something went wrong. Try again.",
        { variant: "error" },
      );
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const [checkStripeStatus, { isFetching: checkStripeAccountStatus }] =
    useLazyCheckStripeStatusQuery();

  const handleCheckStripeAccountStatus = async () => {
    try {
      const res = await checkStripeStatus().unwrap();
      const status = res?.data?.accountStatus;

      if (status === "active") {
        setShowAddCommunityPopup(true);
      } else if (status === "not_connected") {
        setShowConfirmationModal(true);
      } else if (status === "pending") {
        setShowConfirmationModal(true);
      } else {
        enqueueSnackbar("Something went wrong. Try again.", {
          variant: "error",
        });
      }
    } catch (error) {
      if (error?.status === 404) setShowConfirmationModal(true);
      enqueueSnackbar(error?.data?.message || "Something went wrong.", {
        variant: "error",
      });
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setShowAddCommunityPopup(false);
    if (communityUrl) navigate(`/communities/details/${communityUrl}`);
    Cookies.remove("slug");
  };

  const toggleCommunityPopup = () => setShowAddCommunityPopup((prev) => !prev);

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
            <SearchField />
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

      <CommunitiesList limit={12} />

      {/* Stripe permission modal */}
      <PermissionModal
        handleCreateStripeAccount={handleCreateStripeAccount}
        loading={createStripe}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
      />

      <AddCommunity
        showPopup={showAddCommunityPopup}
        setCommunityUrl={setCommunityUrl}
        togglePopup={toggleCommunityPopup}
        setShowAddCommunityPopup={setShowAddCommunityPopup}
        setShowSuccessPopup={setShowSuccessPopup}
      />
      <CommunitySuccessPopup
        showPopup={showSuccessPopup}
        togglePopup={handleCloseSuccessPopup}
        setShowSuccessPopup={setShowSuccessPopup}
      />
    </main>
  );
};

export default CommunitiesPage;
