import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import api from "../../services/axiosInstance";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState(null);

  useEffect(() => {
    document.title = `Sign up - giveXchange`;
    const token = Cookies.get("ownerToken");
    const owner = Cookies.get("owner")
      ? JSON.parse(Cookies.get("owner"))
      : null;

    if (!token) return;
    if (!owner) return;

    if (owner && !owner?.emailVerified)
      navigate("/verify-otp", { replace: true });
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
      location: "",
      zipcode: "",
      city: "",
      state: "",
      country: "United States",
      countryId: 233,
      stateId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim("First name cannot start or end with spaces")
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "First name must contain only letters and spaces"
        )
        .required("First name is required"),
      lastName: Yup.string()
        .trim("Last name cannot start or end with spaces")
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "Last name must contain only letters and spaces"
        )
        .required("Last name is required"),
      communityName: Yup.string()
        .trim("Community name cannot start or end with spaces")
        .min(3, "Community name must contain atleast 3 characters")
        .max(35, "Community name must be 35 characters or less")
        .required("Community name is required"),
      urlSlug: Yup.string()
        .trim("Slug can not start or end with spaces")
        .min(3, "Slug can not be less than 3 characters")
        .max(50, "Slug can not be more than 50 characters")
        .matches(
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens"
        )
        .required("Slug is required"),
      description: Yup.string()
        .trim("Description cannot start or end with spaces")
        .min(11, `Description can not be less than 11 characters`)
        .max(150, `Description can not be more than 150 characters`)
        .required("Description is required"),
      email: Yup.string()
        .trim("Email address can not start or end with spaces")
        .email("Invalid email address")
        .matches(
          /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        )
        .matches(
          /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
          "Email cannot contain consecutive special characters"
        )
        .required("Email address is required"),
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
        .required("Confirm password is required"),
      location: Yup.string()
        .trim("Address can not start or end with spaces")
        .min(1, "Address can not be less than 1 character")
        .max(30, "Address can not be more than 30 characters")
        .required("Please enter your location"),

      zipcode: Yup.string()
        .trim("Zip code can not start or end with spaces")
        .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
        .required("Enter your zip code"),

      city: Yup.string().required("Enter your city"),
      state: Yup.string().required("Enter your state"),
      country: Yup.string().required("Enter your country"),
      profileImage: Yup.mixed().nullable(),
    }),
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      if (slugError) {
        return;
      }
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("firstName", values.firstName.trim());
        formData.append("lastName", values.lastName.trim());
        formData.append("email", values.email.trim());
        formData.append("communityName", values.communityName.trim());
        formData.append("slug", values.urlSlug.trim());
        formData.append("communityDescription", values.description.trim());
        formData.append("password", values.password.trim());
        formData.append("userType", "community_owner");
        formData.append("communityAddress", values.location.trim());
        formData.append("communityZipcode", values.zipcode.trim());
        formData.append("communityCity", values.city.trim());
        formData.append("communityState", values.state.trim());
        formData.append("communityCountry", values.country.trim());

        const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res?.data?.success) {
          Cookies.set("ownerToken", res?.data?.data?.token);
          Cookies.set("owner", JSON.stringify(res?.data?.data?.user));
          Cookies.set("ownerEmail", values.email.trim());
          Cookies.set("slug", values.urlSlug.trim());
          Cookies.set("isOwnerEmailVerified", false);
          resetForm();
          Cookies.set("page", "/signup");
          navigate("/verify-otp", {
            state: {
              page: "/signup",
            },
          });
        }
      } catch (error) {
        // console.error("Sign up error:", error.response?.data);
        enqueueSnackbar(error.response?.data?.message || error?.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!formik.values.urlSlug) return;

    const timeout = setTimeout(() => {
      checkSlugAvailability(formik.values.urlSlug);
    }, 500);

    return () => clearTimeout(timeout);
  }, [formik.values.urlSlug]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[400px] flex flex-col items-start gap-4"
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
            onBlur={formik.handleBlur}
            error={formik.errors.urlSlug || slugError}
            touched={formik.touched.urlSlug}
            label={`URL Slug`}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Community Description
          </label>
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder="Enter description"
            className={`w-full border bg-[var(--secondary-bg)] min-h-[94px] max-h-[94px] px-[15px] py-[14px] rounded-[8px] outline-none ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-[var(--secondary-bg)]"
            }`}
          />
          {(formik.touched.description || formik.errors.description) &&
          formik.errors.description ? (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          ) : null}
        </div>

        {/* Country, State, City, Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">Community Country</label>
            <div className="w-full pointer-events-none">
              <CountrySelect
                defaultValue={{
                  id: 233,
                  name: "United States",
                  iso2: "US",
                  iso3: "USA",
                }}
                disabled={true}
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none disabled:cursor-not-allowed 
        ${
          formik.touched.country && formik.errors.country
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder="Select Country"
                onChange={(val) => {
                  formik.setFieldValue("country", val.name);
                  formik.setFieldValue("countryId", val.id);
                  formik.setFieldValue("state", "");
                  formik.setFieldValue("stateId", "");
                  formik.setFieldValue("city", "");
                }}
              />
            </div>
            {formik.touched.country && formik.errors.country && (
              <p className="text-red-500 text-xs">{formik.errors.country}</p>
            )}
          </div>

          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">Community State</label>
            <StateSelect
              countryid={formik.values.countryId || 0}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none 
        ${
          formik.touched.state && formik.errors.state
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
              placeHolder="Select State"
              onChange={(val) => {
                formik.setFieldValue("state", val.name);
                formik.setFieldValue("stateId", val.id);
                formik.setFieldValue("city", "");
              }}
            />
            {formik.touched.state && formik.errors.state && (
              <p className="text-red-500 text-xs">{formik.errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">Community City</label>
            <CitySelect
              countryid={formik.values.countryId || 0}
              stateid={formik.values.stateId || 0}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none 
        ${
          formik.touched.city && formik.errors.city
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
              placeHolder="Select City"
              onChange={(val) => formik.setFieldValue("city", val.name)}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-500 text-xs">{formik.errors.city}</p>
            )}
          </div>

          <TextField
            type="text"
            name="zipcode"
            placeholder="Enter zip code"
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.zipcode}
            touched={formik.touched.zipcode}
            label="Community Zip Code"
          />
        </div>

        <TextField
          type="text"
          name="location"
          placeholder="Enter your address"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.location}
          touched={formik.touched.location}
          label="Suite / Apartment / Street"
        />

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
