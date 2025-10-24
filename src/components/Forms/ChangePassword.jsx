import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordUpdateSuccessModal from "../Popups/PasswordUpdateSuccessModal";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .trim("Password can not start or end with spaces")
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password cannot be more than 25 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&^#_.-]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Password is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      const userEmail = Cookies.get("ownerEmail");
      const userCode = Cookies.get("otp");
      if (!userEmail) {
        enqueueSnackbar("email not found", {
          variant: "error",
        });
        return;
      }
      if (!userCode) {
        enqueueSnackbar("Code not found", {
          variant: "error",
        });
        return;
      }
      try {
        setLoading(true);
        const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
          email: userEmail.trim(),
          code: userCode.trim(),
          password: values?.password.trim(),
        });

        if (res?.data?.success) {
          resetForm();
          setShowPopup(true);
          Cookies.remove(`userEmail`);
          Cookies.remove(`verifyEmail`);
          Cookies.remove("otp");
        }
      } catch (error) {
        console.log(`reset password error >>> `, error);
        enqueueSnackbar(error?.response?.data?.message || error?.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
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
            <Button type={"submit"} title={`Save`} isLoading={loading} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
