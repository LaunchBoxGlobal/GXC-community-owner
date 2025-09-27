import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;

const CopyCommunityLinkPopup = ({ showPopup, togglePopup, redirectParams }) => {
  // const location = useLocation();
  // const { page } = location.state || {};
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const redirect = searchParams.get("redirect");
  const { setShowCommunityLinkPopup, showCommunityLinkPopup } = useAppContext();

  useEffect(() => {
    document.title = `Account verified - ${PAGETITLE}`;
  }, []);

  const handleContinue = () => {
    setShowCommunityLinkPopup(false);
    // setShowCommunityPopup(true);
    navigate("/complete-profile");
  };

  // const handleContinue = () => {
  //   if (redirectParams) {
  //     setShowEmailVerificationPopup(false);
  //     navigate(redirectParams);
  //     togglePopup();
  //   } else {
  //     navigate("/add-payment-info");
  //     togglePopup();
  //   }
  // };

  return (
    showCommunityLinkPopup && (
      <div className="w-full h-screen fixed inset-0 px-5 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
        <div className="w-full max-w-[471px] bg-[#D1E6D2] p-8 rounded-2xl">
          <div className="w-full text-center">
            <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
              <img
                src="/check-icon.svg"
                alt="check-icon"
                className="w-[31px] h-[23px]"
              />
            </div>
            <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
              Your Community Has Been Created!
            </h1>

            <div className="w-full h-[50px] p-1 bg-white rounded-[12px] flex items-center justify-between pl-4">
              <p className="text-[#565656] leading-none">
                httpscommunity/xyz123
              </p>
              <button
                type="button"
                onClick={() => handleContinue()}
                className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-full block max-w-[110px]"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CopyCommunityLinkPopup;
