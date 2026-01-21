import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import Loader from "../Loader/Loader";
import { useRemoveUserFromCommunityMutation } from "../../services/communityApi/communityApi";

const RemoveUserPopup = ({
  showPopup,
  setShowRemoveUserPopup,
  setOpenActions,
  userId,
  communityId,
  setIsRemoved,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  const [removeUserFromCommunity, { isLoading }] =
    useRemoveUserFromCommunityMutation();

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
    setLoading(true);
    try {
      const res = await removeUserFromCommunity({
        communityId,
        userId,
      }).unwrap();

      if (res?.success) {
        setIsRemoved(true);
        refetch();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setShowRemoveUserPopup(false);
      setOpenActions(null);
    }
  };

  return (
    showPopup && (
      <main className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.4)]">
        <div className="w-full max-w-[471px]  bg-white flex flex-col items-center gap-2 rounded-[18px] p-7 lg:p-10 relative">
          <button
            type="button"
            onClick={() => {
              setShowRemoveUserPopup(false);
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
              src="/remove-member-icon.svg"
              alt="remove-user-modal-icon"
              className="w-[48px] h-[48px] invert brightness-0"
            />
          </div>

          <h2 className="text-[24px] font-semibold leading-[1.3] text-center">
            Remove member
          </h2>
          <p className="text-[var(--secondary-color)] text-center leading-[1.3]">
            Are you sure you want to remove this member from the community?
          </p>
          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <button
              type={"button"}
              onClick={() => {
                setShowRemoveUserPopup(false);
                setOpenActions(null);
              }}
              className="w-full bg-[#F0F0F0] text-black h-[49px] rounded-[8px] text-center font-medium"
            >
              No
            </button>
            <button
              type={"button"}
              onClick={() => handleBlockUser()}
              className="w-full bg-[var(--button-bg)] text-white h-[49px] rounded-[8px] text-center font-medium"
            >
              {loading ? <Loader /> : "Yes"}
            </button>
          </div>
        </div>
      </main>
    )
  );
};

export default RemoveUserPopup;
