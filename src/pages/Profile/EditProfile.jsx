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

const EditProfile = ({ togglePopup, showPopup, fetchUserProfile }) => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePictureUrl); // 👈 pre-fill preview
    }
  }, [user, showPopup]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      description: user?.description || "",
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
      profileImage: Yup.mixed().nullable(),
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
          alert("Profile Updated Successfully!");
        }
      } catch (error) {
        console.error("Update profile error:", error.response?.data);
        if (error?.response?.status === 401) {
          alert("Session expired, please login again.");
        } else {
          alert(error.response?.data?.message || error?.message);
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
      <div className="w-full h-screen bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-10 fixed inset-0 z-50">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-[471px] bg-white p-5 rounded-[18px]"
        >
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
                className={`w-full border h-[142px] px-[15px] py-[14px] rounded-[8px] outline-none
          'error' '&&' 'touched' ? "border-red-500" : "border-[#D9D9D9]"`}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div>{formik.errors.description}</div>
              ) : null}
            </div>

            <div className="w-full">
              <button type="submit" className="button">
                Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default EditProfile;
