import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import ResentOtp from "./ResentOtp";
import EmailVerificationStatusPage from "../../pages/Auth/EmailVerificationStatusPage";
import { useAppContext } from "../../context/AppContext";
import CopyCommunityLinkPopup from "../Popups/CopyCommunityLinkPopup";
import { enqueueSnackbar } from "notistack";
import { RiArrowLeftSLine } from "react-icons/ri";
import ForgetPasswordEmailVerifiedSuccessPopup from "../Popups/ForgetPasswordEmailVerifiedSuccessPopup";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [redirectParams, setRedirectParams] = useState(null);
  const { setShowEmailVerificationPopup } = useAppContext();
  const userEmail = Cookies.get(`userEmail`);
  const page = Cookies.get("page");
  const [showEmailVerificationStatus, setShowEmailVerificationStatus] =
    useState(false);

  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const togglePopup = () => {
    setShowEmailVerificationPopup(true);
  };

  useEffect(() => {
    const isAuthenticated = !!Cookies.get("token");
    const hasEmail = !!userEmail;

    // Redirect only if user is not authenticated AND no email in cookies
    if (!isAuthenticated && !hasEmail) {
      navigate("/login");
    }

    document.title = `Verify OTP - GiveXChange`;
  }, [navigate, userEmail]);

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .test("complete", "OTP is required", (arr) =>
          arr.every((digit) => digit !== "")
        )
        .test("valid", "OTP must be 6 digits", (arr) =>
          /^\d{6}$/.test(arr.join(""))
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const otp = values.otp.join("");
      if (!userEmail) {
        enqueueSnackbar("Email not found", {
          variant: "error",
        });
        return;
      }

      const body =
        page === "/signup" ? { code: otp } : { code: otp, email: userEmail };
      setLoading(true);
      try {
        const url =
          page === "/signup"
            ? `${BASE_URL}/auth/verify-email`
            : page === "/login"
            ? `${BASE_URL}/auth/verify-email`
            : `${BASE_URL}/auth/verify-reset-code`;
        const res = await axios.post(url, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res?.data?.success) {
          resetForm();
          const user = Cookies.get("user")
            ? JSON.parse(Cookies.get("user"))
            : null;
          if (user) {
            user.emailVerified = true;
            Cookies.set("user", JSON.stringify(user));
          }
          Cookies.set("isOwnerEmailVerified", true);

          if (page === "/signup") {
            setShowEmailVerificationPopup(true);
            Cookies.set("isOwnerEmailVerified", true);
            Cookies.remove("userEmail");
          } else if (page === "/forgot-password") {
            Cookies.set("otp", otp);
            setShowEmailVerificationStatus(true);
          }
          if (page === "/login") {
            setShowLinkPopup(true);
            setShowEmailVerificationPopup(true);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("verify email error:", error);
        enqueueSnackbar(error.response?.data?.message || error?.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
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

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[350px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center space-y-3 mt-4">
          <h1 className="font-semibold text-[32px] leading-none">Verify OTP</h1>
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
            <Button type="submit" title="Verify" isLoading={loading} />
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
              Cookies.remove("token");
              Cookies.remove("user");
              Cookies.remove("userEmail");
              Cookies.remove("slug");
              Cookies.remove("isOwnerEmailVerified");
              navigate("/signup");
            }}
            className="text-sm font-medium flex items-center gap-1 text-[var(--primary-color)]"
          >
            Change Email
          </button>
        </div>

        {/* <div className="w-full mt-2 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => {
              navigate("/login");
              Cookies.remove("token");
              Cookies.remove("user");
              Cookies.remove("userEmail");
              Cookies.remove("slug");
              Cookies.remove("isOwnerEmailVerified");
            }}
            className="text-sm font-medium flex items-center gap-1 text-[var(--primary-color)]"
          >
            <div className="w-[18px] h-[18px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
              <RiArrowLeftSLine className="text-white text-base" />
            </div>
            Back
          </button>
        </div> */}
      </form>

      <EmailVerificationStatusPage
        showPopup={showPopup}
        togglePopup={togglePopup}
        redirectParams={redirectParams}
        showLinkPopup={showLinkPopup}
      />

      <ForgetPasswordEmailVerifiedSuccessPopup
        showEmailVerificationPopup={showEmailVerificationStatus}
        handleContinue={handleConitnueChangePassword}
      />

      <CopyCommunityLinkPopup />
    </>
  );
};

export default VerifyOtp;
