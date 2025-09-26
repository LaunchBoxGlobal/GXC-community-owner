import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect } from "react";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import api from "../../services/axiosInstance";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Sign up - ${PAGETITLE}`;
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(25, "Name must be 25 characters or less")
        .required("Name is required"),
      description: Yup.string()
        .min(50, `Description can not be less than 50 characters`)
        .max(500, `Description can not be more than 500 characters`),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password is required"),
      profileImage: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("fullName", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("description", values.description);
        formData.append("userType", "community_owner");

        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Response:", res?.data?.data?.token);

        if (res?.data?.success) {
          Cookies.set("token", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
          resetForm();

          navigate("/verify-otp", {
            state: {
              page: "/signup",
            },
          });
        }
      } catch (error) {
        console.error("Sign up error:", error.response?.data);
        alert(error.response?.data?.message);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center space-y-3">
        <h1 className="font-semibold text-[32px] leading-none">Sign Up</h1>
        <p className="text-[var(--secondary-color)]">
          Please enter details to continue
        </p>
      </div>

      <div className="w-full h-[100px] flex flex-col items-center justify-center gap-2 my-3">
        <AuthImageUpload
          name="profileImage"
          setFieldValue={formik.setFieldValue}
          error={
            formik.errors.profileImage ? formik.touched.profileImage : null
          }
        />
        {/* {formik.errors.profileImage && formik.touched.profileImage && (
          <p className="text-red-500 text-sm">{formik.errors.profileImage}</p>
        )} */}
      </div>

      <div className="w-full space-y-3">
        <TextField
          type="text"
          name="name"
          placeholder="Full Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.name}
          touched={formik.touched.name}
        />
        <TextField
          type="text"
          name="email"
          placeholder="Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <div className="w-full flex flex-col gap-1">
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder="Describe yourself"
            className={`w-full border h-[84px] px-[15px] py-[14px] rounded-[8px] outline-none
          'error' '&&' 'touched' ? "border-red-500" : "border-[#D9D9D9]"`}
          ></textarea>
          {formik.touched.description && formik.errors.description ? (
            <div>{formik.errors.description}</div>
          ) : null}
        </div>

        <PasswordField
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />
        <PasswordField
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <div className="pt-2">
          <Button type="submit" title="Sign Up" />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-6 mt-4">
        <div className="w-full border border-gray-300" />
        <p className="text-gray-400 font-medium">OR</p>
        <div className="w-full border border-gray-300" />
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            Already have an account?{" "}
          </p>
          <Link
            to={`/login`}
            className="font-medium text-[var(--primary-color)]"
          >
            Sign In
          </Link>
        </div>
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

export default SignUpForm;
