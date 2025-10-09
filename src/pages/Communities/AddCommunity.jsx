import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Button from "../../components/Common/Button";
import Cookies from "js-cookie";

const AddCommunity = ({
  showPopup,
  togglePopup,
  setCommunityUrl,
  setShowAddCommunityPopup,
  setShowSuccessPopup,
}) => {
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState(null);

  const checkSlugAvailability = async (slug) => {
    try {
      if (!slug || slug.length < 3) {
        setSlugError("Slug must be at least 3 characters");
        return;
      }

      const res = await axios.get(`${BASE_URL}/communities/check-slug/${slug}`);
      const available = res?.data?.data?.available;

      if (!available) {
        setSlugError("Slug is already taken");
      } else {
        setSlugError(null);
      }
    } catch (err) {
      console.error(err);
      setSlugError("Could not check slug availability");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      urlSlug: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must contain at least 3 characters")
        .max(30, "Name must be 30 characters or less")
        .required("Name is required"),
      urlSlug: Yup.string()
        .min(3, "Slug can not be less than 3 characters")
        .max(50, "Slug can not be more than 50 characters")
        .matches(
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens"
        )
        .required("Slug is required"),
      description: Yup.string()
        .min(30, `Description can not be less than 30 characters`)
        .max(500, `Description can not be more than 500 characters`)
        .required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (slugError) {
        return;
      }
      try {
        setLoading(true);
        const communityRes = await axios.post(
          `${BASE_URL}/communities/create`,
          {
            name: values.name,
            slug: values.urlSlug,
            description: values.description,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (communityRes?.data?.success) {
          Cookies.set("slug", communityRes?.data?.data?.community?.slug);
          resetForm();
          togglePopup();
          setShowAddCommunityPopup(false);
          setShowSuccessPopup(true);
          setCommunityUrl(values.urlSlug);
        }
      } catch (error) {
        alert(error.response?.data?.message || error?.message);
        if (error?.response?.status === 401) {
          Cookies.remove("token");
          Cookies.remove("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    showPopup && (
      <div className="w-full h-screen flex items-center justify-center px-5 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)]">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-[var(--white-bg)] p-7 rounded-[18px] relative w-full max-w-[471px]"
        >
          <div className="w-full flex items-center justify-between gap-5">
            <h3 className="text-[20px] lg:text-[24px] font-semibold leading-none max-w-[80%]">
              Add New Communities
            </h3>
            <button
              type="button"
              onClick={() => setShowAddCommunityPopup(false)}
              className="w-[22px] h-[22px] border border-[#989898] rounded"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full border my-7 border-[#000000]/10" />

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
              label={null}
            />

            <TextField
              type="text"
              name="urlSlug"
              placeholder="URL Slug"
              value={formik.values.urlSlug}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                checkSlugAvailability(e.target.value);
              }}
              error={formik.errors.urlSlug || slugError}
              touched={formik.touched.urlSlug}
              label={null}
            />

            <div className="">
              <textarea
                name="description"
                id="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                placeholder="Describe yourself"
                className={`w-full border h-[124px] px-[15px] py-[14px] rounded-[8px] bg-[var(--secondary-bg)] outline-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-[#D9D9D9]"
                }`}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>

            <div className="w-full">
              <Button
                type={`submit`}
                isLoading={loading}
                title={"Add Community"}
              />
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default AddCommunity;
