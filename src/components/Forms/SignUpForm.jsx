import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import api from "../../services/axiosInstance";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState(null);

  useEffect(() => {
    document.title = `Sign up - GiveXChange`;
  }, []);

  const checkSlugAvailability = async (slug) => {
    try {
      if (!slug || slug.length < 3) {
        setSlugError("Slug must be at least 3 characters");
        return;
      }

      const res = await api.get(`${BASE_URL}/communities/check-slug/${slug}`);
      const available = res?.data?.data?.available;

      if (!available) {
        setSlugError("Slug is already taken");
      } else {
        setSlugError(null);
      }
    } catch (err) {
      setSlugError("Could not check slug availability");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      communityName: "",
      description: "",
      urlSlug: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
          "First name must start with a capital letter and contain only letters and spaces"
        )
        .required("First name is required"),
      lastName: Yup.string()
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
          "Last name must start with a capital letter and contain only letters and spaces"
        )
        .required("Last name is required"),
      communityName: Yup.string()
        .min(3, "Community name must contain atleast 3 characters")
        .max(30, "Community name must be 30 characters or less")
        .required("Community name is required"),
      urlSlug: Yup.string()
        .min(3, "URL slug must contain at least 3 characters")
        .max(30, "Community slug must be 30 characters or less")
        .matches(
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens"
        )
        .required("Community slug is required"),
      description: Yup.string()
        .min(30, `Description can not be less than 30 characters`)
        .max(500, `Description can not be more than 500 characters`)
        .required("Description is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
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
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (slugError) {
        return;
      }
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("communityName", values.communityName);
        formData.append("slug", values.urlSlug);
        formData.append("communityDescription", values.description);
        formData.append("password", values.password);
        formData.append("userType", "community_owner");

        const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.data?.success) {
          Cookies.set("token", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
          Cookies.set("userEmail", values.email);
          Cookies.set("slug", values.urlSlug);
          resetForm();

          navigate("/verify-otp", {
            state: {
              page: "/signup",
            },
          });
        }
      } catch (error) {
        // console.error("Sign up error:", error.response?.data);
        alert(error.response?.data?.message || error?.message);
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
      <div className="w-full text-center space-y-3">
        <h1 className="font-semibold text-[32px] leading-none">Sign Up</h1>
        <p className="text-[var(--secondary-color)]">
          Please enter details to continue
        </p>
      </div>

      <div className="w-full space-y-3 mt-5">
        <div className="w-full grid grid-cols-2 gap-2">
          <TextField
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            label={`First Name`}
          />
          <TextField
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            label={`Last Name`}
          />
        </div>

        <TextField
          type="text"
          name="email"
          placeholder="Enter your email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          label={"Email Address"}
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextField
            type="text"
            name="communityName"
            placeholder="Enter your community name"
            value={formik.values.communityName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.communityName}
            touched={formik.touched.communityName}
            label={`Community Name`}
          />
          <TextField
            type="text"
            name="urlSlug"
            placeholder="Enter your Slug"
            value={formik.values.urlSlug}
            onChange={formik.handleChange}
            onBlur={(e) => {
              formik.handleBlur(e);
              checkSlugAvailability(e.target.value);
            }}
            error={formik.errors.urlSlug || slugError}
            touched={formik.touched.urlSlug}
            label={`URL Slug`}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder="Enter description"
            className={`w-full border min-h-[84px] max-h-[84px] px-[15px] py-[14px] rounded-[8px] outline-none ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-[#D9D9D9]"
            }`}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        <PasswordField
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          label={`Password`}
        />
        <PasswordField
          name="confirmPassword"
          placeholder="Enter your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          label={`Confirm Password`}
        />

        <div className="pt-2">
          <Button type="submit" title="Sign Up" isLoading={loading} />
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
      </div>
    </form>
  );
};

export default SignUpForm;
