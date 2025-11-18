import { useFormik } from "formik";
import PasswordField from "../../components/Common/PasswordField";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useState } from "react";
import Loader from "../../components/Loader/Loader";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Enter your current password"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password cannot be more than 25 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&^#_.-]/,
          "Password must contain at least one special character"
        )
        .required("Enter your new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${BASE_URL}/auth/change-password`,
          { password: values?.password, oldPassword: values.currentPassword },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (res?.data?.success) {
          resetForm();
          enqueueSnackbar("Password changed successfully", {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("change password error:", error.response?.data);
        handleApiError(error, navigate);
        // enqueueSnackbar(error?.message || error?.response?.data?.message, {
        //   variant: "error",
        // });
        // if (error?.response?.status === 401) {
        //   Cookies.remove("token");
        //   Cookies.remove("user");
        //   navigate("/login");
        // }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <h1 className="font-semibold text-[24px]">Change Password</h1>

      <div className="w-full border my-4" />

      <form
        onSubmit={formik.handleSubmit}
        className="w-full mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="currentPassword"
              placeholder="Current Password"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.currentPassword}
              touched={formik.touched.currentPassword}
              label={"Current Password"}
            />
          </div>
        </div>
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="password"
              placeholder="New Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              label={"New Password"}
            />
          </div>
        </div>
        <div className="hidden lg:block w-full"></div>
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              label={"Confirm Password"}
            />
          </div>
        </div>
        <div className="hidden lg:block w-full"></div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="bg-[var(--button-bg)] button max-w-[150px]"
          >
            {loading ? <Loader /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
