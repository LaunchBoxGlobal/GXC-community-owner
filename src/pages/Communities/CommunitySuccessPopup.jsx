import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CommunitySuccessPopup = ({
  showPopup,
  togglePopup,
  setShowSuccessPopup,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const slug = Cookies.get("slug");
    console.log(slug);
    navigate(`/communities/details/${slug}`);
    togglePopup();
  };
  return (
    showPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-5">
        <div className="w-full max-w-[471px] bg-[#fff] p-7 rounded-[24px] relative">
          <button
            type="button"
            onClick={() => setShowSuccessPopup(false)}
            className="absolute top-5 right-5"
          >
            <img
              src="/close-icon.png"
              alt="close icon"
              width={20}
              height={20}
            />
          </button>
          <div className="w-full text-center">
            <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
              <img
                src="/check-icon.svg"
                alt="check-icon"
                className="w-[31px] h-[23px]"
              />
            </div>
            <h3 className="font-semibold text-[20px] lg:text-[24px] leading-[1.3] mt-7">
              Community Created Successfully
            </h3>
            <p className="text-[var(--secondary-color)] mb-5 mt-2">
              Your community has been created successfully
            </p>
            <button
              type="button"
              onClick={() => handleNavigate()}
              // to={`/`}
              className="bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px] w-full"
            >
              View Community Details
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CommunitySuccessPopup;
