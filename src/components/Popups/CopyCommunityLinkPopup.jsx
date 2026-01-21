import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CopyCommunityLinkPopup = ({ isOpen, onClose }) => {
  const slug = Cookies.get("slug");
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.title = "Account verified - giveXchange";
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      const link = `https://user.thegiveXchange.com/community/${slug}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        onClose();
        Cookies.remove("slug");
        navigate("/complete-profile", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-screen fixed inset-0 px-5 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
      <div className="w-full max-w-[491px] bg-[#fff] p-8 rounded-2xl">
        <div className="w-full text-center">
          <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
            <img
              src="/check-icon.svg"
              alt="check-icon"
              className="w-[31px] h-[23px]"
            />
          </div>

          <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-2">
            Your community has been created!
          </h1>

          <p className="text-[#565656] leading-[1.2]">
            Members can join the community using the link below. However, they
            won't be able to list products until the Stripe account setup is
            completed in the next step.
          </p>

          <div className="w-full h-[50px] p-1 bg-[#f5f5f5] rounded-[12px] flex items-center justify-between pl-4 mt-5">
            <p className="text-[#565656] overflow-hidden text-ellipsis">
              www.thegiveXchange.com/community/{slug}
            </p>

            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-[var(--button-bg)] text-white rounded-[8px] font-medium h-full max-w-[110px] px-3"
            >
              {copied ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyCommunityLinkPopup;
