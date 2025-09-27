import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";

const ResentOtp = ({ email, page }) => {
  const handleResendOtp = async () => {
    const email = Cookies.get("signupEmail");
    const url =
      page === "/login" || page === "/signup"
        ? `${BASE_URL}/auth/resend-verification`
        : `${BASE_URL}/auth/forgot-password`;
    try {
      const res = await axios.post(
        url,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error("verify email error:", error);
      alert(error?.message || error.response?.data?.message);
    }
  };
  return (
    <button
      type="button"
      className="font-medium"
      onClick={() => handleResendOtp()}
    >
      Resend
    </button>
  );
};

export default ResentOtp;
