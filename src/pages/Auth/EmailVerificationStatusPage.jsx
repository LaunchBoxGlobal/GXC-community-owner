import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerificationStatusPage = ({
  isOpen,
  showLinkPopup,
  onClose,
  onShowCommunityLink,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Account verified";
  }, []);

  const handleContinue = () => {
    if (showLinkPopup) {
      onClose();
      navigate("/");
    } else {
      onShowCommunityLink();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-screen fixed inset-0 px-5 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
      <div className="w-full max-w-[471px] bg-[#fff] p-8 rounded-2xl">
        <div className="w-full text-center">
          <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
            <img
              src="/check-icon.svg"
              alt="check-icon"
              className="w-[31px] h-[23px]"
            />
          </div>

          <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
            Email has been <br /> verified successfully
          </h1>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium h-[49px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStatusPage;
