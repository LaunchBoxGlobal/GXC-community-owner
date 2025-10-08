import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";

const ResentOtp = ({ email, page }) => {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (timer > 0) return;

    const savedEmail = Cookies.get("signupEmail");
    const url =
      page === "/login" || page === "/signup"
        ? `${BASE_URL}/auth/resend-verification`
        : `${BASE_URL}/auth/forgot-password`;

    try {
      const res = await axios.post(
        url,
        { email: savedEmail || email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar(res?.data?.message, {
          variant: "info",
        });
        setTimer(60);
      }
    } catch (error) {
      // console.error("verify email error:", error);
      enqueueSnackbar(error?.response?.data?.message || error.message, {
        variant: "error",
      });
    }
  };

  return (
    <button
      type="button"
      className={`font-medium text-[var(--button-bg)] ${
        timer > 0 ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleResendOtp}
      disabled={timer > 0 || !email}
    >
      {timer > 0 ? `Resend in ${timer}s` : "Resend"}
    </button>
  );
};

export default ResentOtp;
