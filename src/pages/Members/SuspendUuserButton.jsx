import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import { useBanUserMutation } from "../../services/userApi/userApi";

const SuspendUuserButton = ({ member, communityId, fetchMemberDetails }) => {
  const [banUser, { isLoading }] = useBanUserMutation();

  const membererShipStatus =
    member?.membership?.status === "banned" ? "Unsuspend" : "Suspend";

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
        enqueueSnackbar(res?.data?.message || "Member unbanned successfully!", {
          variant: "success",
        });
        fetchMemberDetails();
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Try again",
        { variant: "error" }
      );
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
