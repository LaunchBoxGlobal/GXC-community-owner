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
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";

const EditCommunity = ({
  showPopup,
  togglePopup,
  setCommunityUrl,
  setShowAddCommunityPopup,
  setShowSuccessPopup,
  setShowEditCommunityPopup,
  showEditCommunityPopup,
  community,
  fetchCommunityDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState(null);
  const navigate = useNavigate();

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
      name: community?.name || "",
      urlSlug: community?.slug || "",
      description: community?.description || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Community name must contain at least 3 characters")
        .max(35, "Community name can not be more than 35 characters")
        .required("Community name is required"),
      urlSlug: Yup.string()
        .min(3, "Slug can not be less than 3 characters")
        .max(50, "Slug can not be more than 50 characters")
        .matches(
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens"
        )
        .required("Slug is required"),
      description: Yup.string()
        .min(11, `Description can not be less than 11 characters`)
        .max(150, `Description can not be more than 150 characters`)
        .required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (slugError) {
        return;
      }
      try {
        setLoading(true);
        const communityRes = await axios.put(
          `${BASE_URL}/communities/${community?.id}`,
          {
            name: values.name.trim(),
            slug: values.urlSlug.trim(),
            description: values.description.trim(),
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
          setShowEditCommunityPopup(false);
          fetchCommunityDetails();
          enqueueSnackbar(communityRes?.data?.message, {
            variant: "success",
          });
          // setShowAddCommunityPopup(false);
          // setShowSuccessPopup(true);
          // setCommunityUrl(values.urlSlug);
        }
      } catch (error) {
        handleApiError(error, navigate);
        // enqueueSnackbar(error.response?.data?.message || error?.message, {
        //   variant: "error",
        // });
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    showEditCommunityPopup && (
      <div className="w-full h-screen flex items-center justify-center px-5 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)]">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-[var(--white-bg)] p-7 rounded-[18px] relative w-full max-w-[471px]"
        >
          <div className="w-full flex items-center justify-between gap-5">
            <h3 className="text-[20px] lg:text-[24px] font-semibold leading-none max-w-[80%]">
              Edit Community
            </h3>
            <button
              type="button"
              onClick={() => setShowEditCommunityPopup(false)}
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
              label={"Comunity Name"}
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
              disabled={true}
              error={formik.errors.urlSlug || slugError}
              touched={formik.touched.urlSlug}
              label={"Community Slug"}
            />

            <div className="">
              <label htmlFor="description" className="text-sm font-medium">
                Community Description
              </label>
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
                    : "border-[var(--secondary-bg)]"
                }`}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>

            <div className="w-full">
              <Button type={`submit`} isLoading={loading} title={"Save"} />
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default EditCommunity;
