import { useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;

const EmailVerificationStatusPage = () => {
  const location = useLocation();
  const { page } = location.state || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    document.title = `Account verified - ${PAGETITLE}`;
  }, []);

  const handleContinue = () => {
    if (redirect) {
      navigate(redirect);
    } else {
      navigate("/add-payment-info");
    }
  };

  return (
    <div className="w-full max-w-[350px]">
      <div className="w-full text-center">
        <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
          <img
            src="/check-icon.svg"
            alt="check-icon"
            className="w-[31px] h-[23px]"
          />
        </div>
        <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
          Email Address <br /> Verified Successfully
        </h1>
        <button
          type="button"
          onClick={() => handleContinue()}
          className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationStatusPage;
