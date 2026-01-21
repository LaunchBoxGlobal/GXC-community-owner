import { useEffect, useState } from "react";
import HomePageStats from "./HomePageStats";
import Cookies from "js-cookie";
import { PermissionModal } from "./StripeAccountPermissionModal";
import { enqueueSnackbar } from "notistack";
import CommunitiesList from "./CommunitiesList";
import {
  useCreateStripeAccountMutation,
  useLazyCheckStripeStatusQuery,
} from "../../services/userApi/userApi";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state?.user?.user);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [checkStripeStatus, { isLoading }] = useLazyCheckStripeStatusQuery();

  const [createStripeAccount, { isLoading: createStripe }] =
    useCreateStripeAccountMutation();

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
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.data?.message ||
          "Something went wrong.",
        {
          variant: "error",
        },
      );
    }
  };

  useEffect(() => {
    document.title = "Dashboard - giveXchange";
    ["email", "signupEmail", "verifyEmail"].forEach((c) => Cookies.remove(c));
    handleCheckStripeAccountStatus();
  }, []);

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
      <HomePageStats />

      <div className="w-full mt-5">
        <h2 className="text-[24px] lg:text-[32px] font-semibold">
          Recent Communities
        </h2>
        <CommunitiesList limit={12} />
      </div>

      {!isLoading && (
        <PermissionModal
          handleCreateStripeAccount={async () => {
            try {
              const res = await createStripeAccount().unwrap();
              if (res?.success) {
                window.open(res.data.url, "_blank");
              }
            } catch (error) {
              enqueueSnackbar(
                error?.data?.message || "Something went wrong. Try again.",
                { variant: "error" },
              );
            } finally {
              setShowConfirmationModal(false);
            }
          }}
          loading={createStripe}
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
    </main>
  );
};

export default HomePage;
