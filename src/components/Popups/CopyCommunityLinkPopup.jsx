import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";

const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;

const CopyCommunityLinkPopup = () => {
  const slug = Cookies.get("slug");
  const navigate = useNavigate();
  const { setShowCommunityLinkPopup, showCommunityLinkPopup } = useAppContext();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = `Account verified - ${PAGETITLE}`;
  }, []);

  const handleCopyLink = async () => {
    try {
      const link = `invite.app.thegivexchange.com/${slug}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        setShowCommunityLinkPopup(false);
        navigate("/complete-profile");
        Cookies.remove("slug");
      }, 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    showCommunityLinkPopup && (
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
            <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
              Your community has been created!
            </h1>

            <div className="w-full h-[50px] p-1 bg-[#f5f5f5] rounded-[12px] flex items-center justify-between pl-4">
              <p className="text-[#565656] leading-none overflow-hidden text-ellipsis">
                www.thegivexchange/community/{slug}
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-full block max-w-[110px] transition-all"
              >
                {copied ? "Link Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CopyCommunityLinkPopup;
