import { MdPayments } from "react-icons/md";
import Loader from "../../components/Loader/Loader";

export const PermissionModal = ({
  handleCreateStripeAccount,
  loading,
  showConfirmationModal,
  setShowConfirmationModal,
}) => {
  return (
    showConfirmationModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-5">
        <div className="w-full max-w-[471px] bg-white rounded-[12px] p-6 relative text-center flex flex-col items-center justify-center gap-2">
          <div className="w-[102px] h-[102px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <MdPayments className="text-white text-5xl" />
          </div>
          <h2 className="text-[24px] font-semibold leading-none">
            Stripe Account Required
          </h2>
          <p className="text-base font-normal text-[#565656]">
            You need to create a stripe account to continue.
          </p>
          <div className="w-full grid grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => setShowConfirmationModal((prev) => !prev)}
              className="bg-[#ECECEC] h-[48px] rounded-[12px] text-center font-medium"
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleCreateStripeAccount()}
              className="bg-[var(--button-bg)] h-[48px] rounded-[12px] text-center font-medium text-white"
            >
              {loading ? <Loader /> : "Continue"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};
