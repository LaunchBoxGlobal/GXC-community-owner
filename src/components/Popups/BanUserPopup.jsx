import { enqueueSnackbar } from "notistack";
import Loader from "../Loader/Loader";
import { useBanUserMutation } from "../../services/userApi/userApi";

const BanUserPopup = ({
  showPopup,
  setShowBlockUserPopup,
  setOpenActions,
  userId,
  communityId,
  setIsBanned,
  refetch,
}) => {
  const [banUser, { isLoading }] = useBanUserMutation();

  const handleBlockUser = async () => {
    if (!communityId) {
      enqueueSnackbar("Community ID is not defined", {
        variant: "error",
      });
      return;
    }
    if (!userId) {
      enqueueSnackbar("User ID is not defined", {
        variant: "error",
      });
      return;
    }
    try {
      const res = await banUser({
        communityId,
        userId,
        action: "ban",
      }).unwrap();

      if (res?.success) {
        setOpenActions(false);
        refetch();
        setIsBanned(true);
      }
    } catch (error) {
      console.log("Block user error >>> ", error);
    } finally {
      setOpenActions(null);
      setShowBlockUserPopup(false);
    }
  };

  return (
    showPopup && (
      <main className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.4)]">
        <div className="w-full max-w-[481px]  bg-white flex flex-col items-center gap-2 rounded-[18px] p-7 lg:p-10 relative">
          <button
            type="button"
            onClick={() => {
              setShowBlockUserPopup(false);
              setOpenActions(null);
            }}
            className="absolute top-5 right-5"
          >
            <img
              src="/modal-close-icon.svg"
              alt="modal-close-icon"
              className="w-[22px] h-[22px]"
            />
          </button>
          <div className="w-[107px] h-[107px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <img
              src="/block-member-icon.svg"
              alt="block-member-icon"
              className="w-[48px] h-[48px] invert brightness-0"
            />
          </div>
          <h2 className="text-[24px] font-semibold leading-[1.3] text-center">
            Block member
          </h2>
          <p className="text-[var(--secondary-color)] text-center leading-[1.3]">
            Are you sure you want to block this member?
          </p>
          <p className="text-[var(--secondary-color)] text-center leading-[1.3]">
            When you block a member, they’ll be removed from the community. To
            let them rejoin using an invite link, you’ll need to unblock them in
            the Blocked Members tab.
          </p>
          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <button
              type={"button"}
              onClick={() => {
                setShowBlockUserPopup(false);
                setOpenActions(null);
              }}
              className="w-full bg-[#F0F0F0] text-black h-[49px] rounded-[8px] text-center font-medium"
            >
              No
            </button>
            <button
              type={"button"}
              disabled={isLoading}
              onClick={() => handleBlockUser()}
              className="w-full bg-[var(--button-bg)] text-white h-[49px] rounded-[8px] text-center font-medium"
            >
              {isLoading ? <Loader /> : "Yes"}
            </button>
          </div>
        </div>
      </main>
    )
  );
};

export default BanUserPopup;
