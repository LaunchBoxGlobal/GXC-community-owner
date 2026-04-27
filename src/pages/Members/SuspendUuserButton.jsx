import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import { useBanUserMutation } from "../../services/userApi/userApi";
import { useTranslation } from "react-i18next";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";

const SuspendUuserButton = ({ member, communityId, fetchMemberDetails }) => {
  const [banUser, { isLoading }] = useBanUserMutation();
  const { t } = useTranslation("communities");
  const navigate = useNavigate();

  const membererShipStatus =
    member?.membership?.status === "banned"
      ? t("communitiesPage.buttons.Unsuspend")
      : t("communitiesPage.buttons.Suspend");

  const handleblockUser = async () => {
    const userStatus =
      member?.membership?.status === "banned" ? "unban" : "ban";
    const userId = member?.member?.id;
    try {
      const res = await banUser({
        communityId,
        userId,
        action: userStatus,
      }).unwrap();

      if (res?.success) {
        enqueueSnackbar(
          res?.data?.message || t("Member unbanned successfully!"),
          {
            variant: "success",
          },
        );
        fetchMemberDetails();
      }
    } catch (error) {
      handleApiError(error, navigate);
      // enqueueSnackbar(
      //   error?.response?.data?.message ||
      //     error?.message ||
      //     "Something went wrong. Try again",
      //   { variant: "error" },
      // );
    }
  };

  return (
    <div className="w-full max-w-[150px]">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleblockUser()}
        className="button"
      >
        {isLoading ? <Loader /> : membererShipStatus}
      </button>
    </div>
  );
};

export default SuspendUuserButton;
