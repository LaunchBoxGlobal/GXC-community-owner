import { useFormik } from "formik";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { useNavigate } from "react-router-dom";
import PasswordUpdateSuccessModal from "../Popups/PasswordUpdateSuccessModal";
import { useState } from "react";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import {
  changePasswordInitialValues,
  changePasswordSchema,
} from "../../schema/changePasswordSchema";
import { useResetPasswordMutation } from "../../services/authApi/authApi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: changePasswordInitialValues,
    validationSchema: changePasswordSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const userEmail = Cookies.get("ownerEmail");
      const userCode = Cookies.get("otp");

      if (!userEmail) {
        enqueueSnackbar("Please verify your email.", { variant: "error" });
        navigate("/forgot-password");
        return;
      }

      if (!userCode) {
        enqueueSnackbar("Please verify your email.", { variant: "error" });
        navigate("/forgot-password");
        return;
      }

      try {
        const res = await resetPassword({
          email: userEmail.trim(),
          code: userCode.trim(),
          password: values.password.trim(),
        }).unwrap();

        if (res?.success) {
          resetForm();
          setShowPopup(true);
          Cookies.remove("ownerEmail");
          Cookies.remove("verifyEmail");
          Cookies.remove("otp");
        }
      } catch (error) {
        enqueueSnackbar(
          error?.data?.message || error?.message || "Password reset failed",
          { variant: "error" }
        );
      }
    },
  });

  const handleTogglePopup = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <>
      <PasswordUpdateSuccessModal
        showPopup={showPopup}
        handleTogglePopup={handleTogglePopup}
      />
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[350px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center">
          <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
            Set New Password
          </h2>
          <p className="text-[var(--secondary-color)]">
            Enter new password to continue
          </p>
        </div>

        <div className="w-full space-y-3 mt-4">
          <PasswordField
            name={`password`}
            placeholder={`New Password`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            label={"New Password"}
          />
          <PasswordField
            name={`confirmPassword`}
            placeholder={`Confirm Password`}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            label={"Confirm Password"}
          />

          <div className="pt-2">
            <Button type={"submit"} title={`Save`} isLoading={isLoading} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
