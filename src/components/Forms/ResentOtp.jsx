import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  useResendOtpMutation,
  useVerifyForgotPasswordEmailMutation,
} from "../../services/authApi/authApi";

const ResentOtp = ({ email, page }) => {
  const [timer, setTimer] = useState(60);

  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const [verifyForgotPasswordEmail, { isLoading: isForgotResending }] =
    useVerifyForgotPasswordEmailMutation();

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
    const finalEmail = savedEmail || email;

    try {
      const response =
        page === "/login" || page === "/signup"
          ? await resendOtp({ email: finalEmail }).unwrap()
          : await verifyForgotPasswordEmail({
              email: finalEmail,
            }).unwrap();

      enqueueSnackbar(response?.message, {
        variant: "success",
      });

      setTimer(60);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || "Something went wrong.", {
        variant: "error",
      });
    }
  };

  const isDisabled = timer > 0 || !email || isResending || isForgotResending;

  return (
    <button
      type="button"
      className={`font-medium text-[var(--button-bg)] ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleResendOtp}
      disabled={isDisabled}
    >
      {timer > 0 ? `Resend in ${timer}s` : "Resend"}
    </button>
  );
};

export default ResentOtp;
