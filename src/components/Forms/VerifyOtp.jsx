import { useFormik } from "formik";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ResentOtp from "./ResentOtp";
import EmailVerificationStatusPage from "../../pages/Auth/EmailVerificationStatusPage";
import CopyCommunityLinkPopup from "../Popups/CopyCommunityLinkPopup";
import { enqueueSnackbar } from "notistack";
import ForgetPasswordEmailVerifiedSuccessPopup from "../Popups/ForgetPasswordEmailVerifiedSuccessPopup";
import {
  verifyOtpInitialValues,
  verifyOtpValidationSchema,
} from "../../schema/verifyOtpSchema";
import {
  useVerifyEmailMutation,
  useVerifyOtpMutation,
} from "../../services/authApi/authApi";
import { setUser } from "../../features/userSlice/userSlice";
import { useDispatch } from "react-redux";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userEmail = Cookies.get(`ownerEmail`)
    ? Cookies.get(`ownerEmail`)
    : null;
  const page = Cookies.get("page");
  const [showEmailVerificationStatus, setShowEmailVerificationStatus] =
    useState(false);

  const [showLinkPopup, setShowLinkPopup] = useState(false);

  const [showEmailVerificationPopup, setShowEmailVerificationPopup] =
    useState(false);

  const [showCommunityLinkPopup, setShowCommunityLinkPopup] = useState(false);

  const [verifyEmail, { isLoading: isVerifyingEmail }] =
    useVerifyEmailMutation();

  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  useEffect(() => {
    const userCookie = Cookies.get("owner")
      ? JSON.parse(Cookies.get("owner"))
      : null;
    if (userCookie && userCookie?.emailVerified) {
      navigate("/complete-profile", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    document.title = `Verify OTP - giveXchange`;
  }, []);

  const formik = useFormik({
    initialValues: verifyOtpInitialValues,
    validationSchema: verifyOtpValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const otp = values.otp.join("");

      if (!userEmail) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
        return;
      }

      const body =
        page === "/signup"
          ? { code: Number(otp) }
          : { code: otp, email: userEmail };

      try {
        let res;

        if (page === "/signup" || page === "/login") {
          res = await verifyEmail(body).unwrap();
        } else {
          res = await verifyOtp(body).unwrap();
        }

        if (res?.success) {
          resetForm();

          const userCookie = Cookies.get("owner")
            ? JSON.parse(Cookies.get("owner"))
            : null;

          if (userCookie) {
            userCookie.emailVerified = true;
            Cookies.set("owner", JSON.stringify(userCookie));
            dispatch(setUser(userCookie));
          }

          Cookies.set("isOwnerEmailVerified", true);

          if (page === "/signup") {
            setShowEmailVerificationPopup(true);
            Cookies.remove("ownerEmail");
            return;
          }

          if (page === "/forgot-password") {
            Cookies.set("otp", otp);
            setShowEmailVerificationStatus(true);
            return;
          }

          if (page === "/login") {
            setShowLinkPopup(true);
            setShowEmailVerificationPopup(true);
            return;
          }

          navigate("/");
        }
      } catch (error) {
        console.log("verify email error >>> ", error);
      }
    },
  });

  const handleChange = (e, idx) => {
    const { value } = e.target;

    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[idx] = value;
      formik.setFieldValue("otp", newOtp);

      if (value && idx < 5) {
        inputRefs.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !formik.values.otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").slice(0, 6).split("");

    if (pastedData.every((ch) => /^[0-9]$/.test(ch))) {
      const newOtp = Array(6).fill("");
      pastedData.forEach((ch, i) => {
        newOtp[i] = ch;
      });
      formik.setFieldValue("otp", newOtp);
      newOtp.forEach((val, i) => {
        if (inputRefs.current[i]) inputRefs.current[i].value = val;
      });
    }
  };

  const handleConitnueChangePassword = () => {
    setShowEmailVerificationStatus(false);
    navigate(`/change-password`);
  };

  const handleNavigateToChangeEmail = () => {
    if (page === "/signup") {
      navigate(`/change-email`, {
        state: { page: "/signup" },
      });
    } else if (page === "/forgot-password") {
      navigate(`/forgot-password`, {
        state: { email: userEmail },
      });
    } else if (page === "/login") {
      navigate(redirect ? redirect : "/");
    } else {
      navigate(redirect ? redirect : "/");
    }
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[350px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center space-y-3 mt-4">
          <h1 className="font-semibold text-[32px] leading-none">
            Verify 6-digit code
          </h1>
          {userEmail ? (
            <p className="text-[var(--secondary-color)]">
              Verify the code sent at{" "}
              <span className="text-black font-medium">{userEmail}</span>
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="w-full space-y-3 mt-3">
          <div className="w-full flex justify-between" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[i] = el)}
                value={formik.values.otp[i]}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-[49px] border h-[49px] text-center text-lg font-medium rounded-[8px] outline-none bg-[var(--secondary-bg)]
                ${
                  formik.errors.otp
                    ? "border-red-500"
                    : "border-[var(--secondary-bg)]"
                }`}
              />
            ))}
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              title="Verify"
              isLoading={isVerifyingEmail || isVerifyingOtp}
            />
          </div>
        </div>

        <div className="w-full mt-2 flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-center gap-1">
            <p className="text-[var(--secondary-color)]">
              Didn't receive the code yet?{" "}
            </p>
            <ResentOtp page={page} email={userEmail} />
          </div>
        </div>

        <div className="w-full mt-2 flex items-center gap-2 justify-center">
          <p className="">Entered wrong email?</p>
          <button
            type="button"
            onClick={() => {
              handleNavigateToChangeEmail();
            }}
            className="text-sm font-medium flex items-center gap-1 text-[var(--primary-color)]"
          >
            Change Email
          </button>
        </div>
      </form>

      <EmailVerificationStatusPage
        isOpen={showEmailVerificationPopup}
        showLinkPopup={showLinkPopup}
        onClose={() => setShowEmailVerificationPopup(false)}
        onShowCommunityLink={() => setShowCommunityLinkPopup(true)}
      />

      <ForgetPasswordEmailVerifiedSuccessPopup
        showEmailVerificationPopup={showEmailVerificationStatus}
        handleContinue={handleConitnueChangePassword}
      />

      <CopyCommunityLinkPopup
        isOpen={showCommunityLinkPopup}
        onClose={() => setShowCommunityLinkPopup(false)}
      />
    </>
  );
};

export default VerifyOtp;
