import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
import { completeProfileValidationSchema } from "../../schema/completeProfileValidationSchema";
import {
  useCompleteUserProfileMutation,
  useUploadProfilePictureMutation,
} from "../../services/userApi/userApi";
import { useSelector } from "react-redux";

const EditProfile = ({ togglePopup, showPopup, fetchUserProfile }) => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const user = useSelector((state) => state?.user?.user);

  const [updateProfile, { isLoading }] = useCompleteUserProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploadingProfile }] =
    useUploadProfilePictureMutation();

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
    validationSchema: completeProfileValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const profileRes = await updateProfile({
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
        }).unwrap();

        if (values.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("profilePicture", values.profileImage);

          await uploadProfilePicture(formData).unwrap();
        }

        if (profileRes?.success) {
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
                <button
                  type="submit"
                  disabled={loading || isUploadingProfile}
                  className="button"
                >
                  {isLoading ? <Loader /> : "Update Profile"}
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
