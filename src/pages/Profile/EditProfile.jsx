import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import { useAppContext } from "../../context/AppContext";
import { enqueueSnackbar } from "notistack";
import PhoneNumberField from "../../components/Common/PhoneNumberField";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Loader from "../../components/Loader/Loader";
import { handleApiError } from "../../utils/handleApiError";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const EditProfile = ({ togglePopup, showPopup, fetchUserProfile }) => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  const parsedPhone = parsePhoneNumberFromString(user?.phone || "");

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePictureUrl);
    }
  }, [user, showPopup]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      profileImage: null,
      phoneNumber: user?.phone || "",
      city: user?.city || "",
      state: user?.state || "",
      country: "United States",
      countryId: 233,
      stateId: "",
      zipcode: user?.zipcode || "",
      location: user?.address || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim("First name can not start or end with spaces")
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "First name must contain only letters and spaces"
        )
        .required("First name is required"),
      lastName: Yup.string()
        .trim("Last name can not start or end with spaces")
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "Last name must contain only letters and spaces"
        )
        .required("Last name is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .test("is-valid-phone", "Invalid phone number", (value) => {
          if (!value) return false;

          const phone = parsePhoneNumberFromString(value);

          return phone ? phone.isValid() : false;
        }),
      email: Yup.string()
        .trim("Email address can not start or end with spaces")
        .email("Invalid email address")
        .required("Email is required"),
      profileImage: Yup.mixed().nullable(),
      city: Yup.string()
        .trim("City name not start or end with spaces")
        .min(3, "City name cannot be less than 3 characters")
        .max(15, "City name cannot be more than 15 characters")
        .matches(
          /^[A-Za-z ]+$/,
          "City name must contain only letters and spaces"
        )
        .required("Enter your city"),

      state: Yup.string()
        .trim("State can not start or end with spaces")
        .min(3, "State can not be less than 3 characters")
        .max(15, "State can not be more than 15 characters")
        .matches(
          /^[A-Za-z ]+$/,
          "State name must contain only letters and spaces"
        )
        .required("Enter your state"),

      country: Yup.string()
        .trim("AddCountryres can not start or end with spaces")
        .min(3, "Country name can not be less than 3 characters")
        .max(15, "Country name can not be more than 15 characters")
        .matches(
          /^[A-Za-z ]+$/,
          "Country name must contain only letters and spaces"
        )
        .required("Enter your country"),
      location: Yup.string()
        .trim("Address can not start or end with spaces")
        .min(1, `Address cannot be less than 1 characters`)
        .max(30, `Address can not be more than 30 characters`)
        .required("Please enter your location"),
      zipcode: Yup.string()
        .trim("Zip code can not start or end with spaces")
        .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
        .required("Enter your zip code"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            description: null,
            country: values?.country,
            state: values?.state,
            city: values?.city,
            zipcode: values?.zipcode,
            address: values?.location,
            phone: values?.phoneNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (values.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("profilePicture", values.profileImage);

          const imageRes = await axios.post(
            `${BASE_URL}/auth/upload-profile-picture`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
          // console.log("Image uploaded:", imageRes.data);
        }

        if (profileRes?.data?.success) {
          resetForm();
          togglePopup();
          fetchUserProfile();
          enqueueSnackbar("Profile Updated Successfully!", {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("Update profile error:", error.response?.data);
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, or JPEG images are allowed.");
      e.target.value = ""; // reset input
      setPreview(null);
      formik.setFieldValue("profileImage", null);
      return;
    }

    // ✅ Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("File size must be less than 2MB.");
      e.target.value = "";
      setPreview(null);
      formik.setFieldValue("profileImage", null);
      return;
    }

    // ✅ If valid — clear error, set preview, and update Formik
    setFileError(null);
    setPreview(URL.createObjectURL(file));
    formik.setFieldValue("profileImage", file);
  };

  return (
    showPopup && (
      <div className="w-full min-h-screen bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-10 fixed inset-0 z-50">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-[471px] bg-white pl-5 py-5 rounded-[18px] max-h-[90vh] overflow-hidden"
        >
          <div className="overflow-y-auto max-h-[80vh] pr-5">
            <div className="w-full flex items-center justify-between gap-5">
              <h2 className="text-[24px] font-semibold">Edit Profile</h2>
              <button
                type="button"
                className="text-2xl"
                onClick={() => togglePopup()}
              >
                <IoClose />
              </button>
            </div>

            <div className="w-full my-6">
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-start gap-4">
                  <label
                    htmlFor="profileImage"
                    className={`bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-dashed overflow-hidden ${
                      fileError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiPlus className="text-3xl" />
                    )}
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label
                      htmlFor="profileImage"
                      className={`underline text-[15px] font-medium cursor-pointer ${
                        fileError
                          ? "text-red-500"
                          : "text-[var(--primary-blue)] hover:opacity-80"
                      }`}
                    >
                      Upload Profile Picture
                    </label>
                    {fileError && (
                      <p className="text-red-500 text-xs font-medium mt-1">
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>

                {/* 👇 Inline error message */}
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="w-full grid grid-cols-2 gap-3">
                <TextField
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.firstName}
                  touched={formik.touched.firstName}
                />
                <TextField
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.lastName}
                  touched={formik.touched.lastName}
                />
              </div>
              <TextField
                type="text"
                name="email"
                disabled={true}
                placeholder="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.email}
                touched={formik.touched.email}
              />
              <PhoneNumberField
                type="text"
                name="phoneNumber"
                placeholder="+000 0000 00"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.phoneNumber}
                touched={formik.touched.phoneNumber}
                label={null}
              />
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="w-full flex flex-col gap-1">
                  <label className="text-sm font-medium">Country</label>
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
                      inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                        formik.touched.country && formik.errors.country
                          ? "border-red-500"
                          : "border-gray-200"
                      } disabled:cursor-not-allowed`}
                      placeHolder="Select Country"
                      onChange={(val) => {
                        formik.setFieldValue("country", val.name);
                        formik.setFieldValue("countryId", val.id);
                        formik.setFieldValue("state", "");
                        formik.setFieldValue("city", "");
                      }}
                    />
                  </div>
                  {formik.touched.country && formik.errors.country && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.country}
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label className="text-sm font-medium">State</label>
                  <StateSelect
                    countryid={formik.values.countryId || undefined}
                    containerClassName="w-full"
                    inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                      formik.touched.state && formik.errors.state
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeHolder="Select State"
                    onChange={(val) => {
                      formik.setFieldValue("state", val.name);
                      formik.setFieldValue("stateId", val.id);
                      formik.setFieldValue("city", "");
                    }}
                    defaultValue={
                      formik.values.state ? { name: formik.values.state } : null
                    }
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.state}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col gap-1 mt-3">
                <label className="text-sm font-medium">City</label>
                <CitySelect
                  countryid={formik.values.countryId || undefined}
                  stateid={formik.values.stateId || undefined}
                  containerClassName="w-full"
                  inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeHolder="Select City"
                  onChange={(val) => formik.setFieldValue("city", val.name)}
                  defaultValue={
                    formik.values.city ? { name: formik.values.city } : null
                  }
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
                label="Zip Code"
              />
              <TextField
                type="text"
                name="location"
                placeholder="Enter address"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.location}
                touched={formik.touched.location}
                label="Suite / Apartment / Street"
              />

              <div className="w-full">
                <button type="submit" disabled={loading} className="button">
                  {loading ? <Loader /> : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default EditProfile;
