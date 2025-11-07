import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Verify Email - giveXchange`;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim("Email address can not start or end with spaces")
        .email("Invalid email address")
        .required("Email addres is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/forgot-password`,
          { email: values.email.trim() },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res?.data?.success) {
          Cookies.set("ownerEmail", values.email.trim());
          Cookies.set("page", "/forgot-password");
          resetForm();
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
          navigate("/verify-otp", {
            state: {
              page: "/forgot-password",
              email: values.email,
            },
          });
        }
      } catch (error) {
        // console.error("verify email error:", error);
        enqueueSnackbar(error.response?.data?.message || error?.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center">
        <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
          Forgot Password
        </h2>
        <p className="text-[var(--secondary-color)]">
          Enter your registered email address below
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-4">
        <TextField
          type="text"
          name="email"
          placeholder="Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          label={`Email Address`}
        />

        <div className="pt-2 w-full">
          <Button type={"submit"} title={`Send`} isLoading={loading} />
        </div>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <Link
          to={`/login`}
          className="text-sm font-medium flex items-center gap-1 text-[var(--primary-color)]"
        >
          <div className="w-[18px] h-[18px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <RiArrowLeftSLine className="text-white text-base" />
          </div>
          Back
        </Link>
      </div>
    </form>
  );
};

export default VerifyEmail;
