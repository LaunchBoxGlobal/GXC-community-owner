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

const EditProfile = ({ togglePopup, showPopup, fetchUserProfile }) => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();

  console.log(user);

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePictureUrl); // 👈 pre-fill preview
    }
  }, [user, showPopup]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      description: user?.description || "",
      profileImage: null,
      phoneNumber: user?.phone || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
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
      description: Yup.string()
        .notRequired()
        .nullable()
        .test(
          "len",
          "Description must be between 10 and 500 characters",
          (val) => !val || (val.length >= 10 && val.length <= 500)
        ),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{11}$/, "Phone number must contain 11 digits")
        .required("Enter your phone number"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      profileImage: Yup.mixed().nullable(),
      city: Yup.string()
        .min(3, "City name cannot be less than 3 characters")
        .max(15, "City name cannot be more than 15 characters")
        .matches(
          /^[A-Z][a-zA-Z\s]*$/,
          "City must start with uppercase and contain only letters and spaces"
        )
        .required("Enter your city"),

      state: Yup.string()
        .min(3, "State cannot be less than 3 characters")
        .max(15, "State cannot be more than 15 characters")
        .matches(
          /^[A-Z][a-zA-Z\s]*$/,
          "State must start with uppercase and contain only letters and spaces"
        )
        .required("Enter your state"),

      country: Yup.string()
        .min(3, "Country name cannot be less than 3 characters")
        .max(15, "Country name cannot be more than 15 characters")
        .matches(
          /^[A-Z][a-zA-Z\s]*$/,
          "Country must start with uppercase and contain only letters and spaces"
        )
        .required("Enter your country"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            fullName: values.name,
            email: values.email,
            description: values.description,
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
          console.log("Image uploaded:", imageRes.data);
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
        if (error?.response?.status === 401) {
          enqueueSnackbar("Session expired, please login again.", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(error.response?.data?.message || error?.message, {
            variant: "error",
          });
        }
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      formik.setFieldValue("profileImage", file);
    }
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
              <div className="w-full flex items-center justify-start gap-4">
                <label
                  htmlFor="profileImage"
                  className="bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed overflow-hidden"
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
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="">
                  <label
                    htmlFor="profileImage"
                    className={`underline text-[15px] font-medium cursor-pointer text-[var(--primary-blue)]`}
                  >
                    Upload Profile Picture
                  </label>
                  {/* {error && (
                <span className="text-xl text-red-500 font-medium">*</span>
              )} */}
                </div>
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
                <TextField
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.city}
                  touched={formik.touched.city}
                />
                <TextField
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.state}
                  touched={formik.touched.state}
                />
              </div>
              <TextField
                type="text"
                name="country"
                placeholder="Country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.country}
                touched={formik.touched.country}
              />
              {/* {user && user?.description && ( */}
              <div className="w-full flex flex-col gap-1">
                <textarea
                  name="description"
                  id="description"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  placeholder="Describe yourself"
                  className={`w-full border h-[142px] px-[15px] py-[14px] rounded-[8px] outline-none bg-[var(--secondary-bg)] border-[var(--secondary-bg)]`}
                ></textarea>
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>
              {/* )} */}

              <div className="w-full">
                <button type="submit" className="button">
                  Update Profile
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
