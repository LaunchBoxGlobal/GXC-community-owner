import { useState } from "react";
import VerifyOtpForAccountDeletionModal from "./VerifyOtpForAccountDeletionModal";
import Loader from "../../components/Loader/Loader";
import { useRequestDeleteAccountOtpMutation } from "../../services/userApi/userApi";
import { useSelector } from "react-redux";
import { extractEmailDomain } from "../../utils/extractEmailDomain";
import { useTranslation } from "react-i18next";

const DeleteAccountPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [requestDeleteAccountOtp, { isLoading }] =
    useRequestDeleteAccountOtpMutation();
  const user = useSelector((state) => state.user.user);
  const { t } = useTranslation("settings");

  const handleCloseModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleSendOtp = async () => {
    try {
      const res = await requestDeleteAccountOtp({}).unwrap();

      if (res?.success) {
        setShowModal(true);
      }
    } catch (error) {
      console.log("err while requesting an otp >> ", error);
    }
  };

  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">
        {t(`Delete Account`)}
      </h2>
      <div className="w-full border my-5" />

      <div className="w-full flex items-center justify-between flex-wrap gap-5">
        <div className="w-full max-w-[80%]">
          <h3 className="font-medium text-lg leading-[1.3]">
            {t(`We will send 6 digits code to`)}{" "}
            {user?.email && (
              <span className="font-semibold">
                {`${user?.email?.slice(0, 2)}********${extractEmailDomain(
                  user?.email,
                )}`}{" "}
              </span>
            )}
            {t(`to confirm deletion.`)}
          </h3>
          <p className="leading-none mt-2 lg:mt-0">
            {t(`Your data will be removed from our database permanently.`)}
          </p>
        </div>
        <div className="">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSendOtp()}
            className="button min-w-[150px]"
          >
            {isLoading ? <Loader /> : t("Send")}
          </button>
        </div>
      </div>

      <VerifyOtpForAccountDeletionModal
        showModal={showModal}
        onClose={handleCloseModal}
        handleSendOtp={handleSendOtp}
      />
    </div>
  );
};

export default DeleteAccountPage;
