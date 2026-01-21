import { useEffect, useState } from "react";
import HomePageStats from "./HomePageStats";
import Cookies from "js-cookie";
import { PermissionModal } from "./StripeAccountPermissionModal";
import { enqueueSnackbar } from "notistack";
import CommunitiesList from "./CommunitiesList";
import { useCreateStripeAccountMutation } from "../../services/userApi/userApi";
import { useCheckStripeStatusQuery } from "../../services/dashboardApi/dashboardApi";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state?.user?.user);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { error: stripeError } = useCheckStripeStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createStripeAccount, { isLoading: createStripe }] =
    useCreateStripeAccountMutation();

  useEffect(() => {
    document.title = "Dashboard - giveXchange";
    [("email", "signupEmail", "verifyEmail")].forEach((c) => Cookies.remove(c));
  }, []);

  useEffect(() => {
    if (stripeError?.status === 404) {
      setShowConfirmationModal(true);
    }
  }, [stripeError]);

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
              { variant: "error" }
            );
          } finally {
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
