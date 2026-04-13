import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  useResendOtpMutation,
  useVerifyForgotPasswordEmailMutation,
} from "../../services/authApi/authApi";
import { useTranslation } from "react-i18next";

const ResentOtp = ({ email, page }) => {
  const [timer, setTimer] = useState(60);
  const { t } = useTranslation(`auth`);

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
      enqueueSnackbar(
        error?.data?.message || t(`resendOtp.somethingWentWrong`),
        {
          variant: "error",
        },
      );
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
      {timer > 0 ? `${t(`resendOtp.resendIn`)} ${timer}s` : t(`buttons.resend`)}
    </button>
  );
};

export default ResentOtp;
