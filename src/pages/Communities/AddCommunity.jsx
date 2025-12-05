import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Button from "../../components/Common/Button";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { communitySchema } from "../../schema/communitySchema";

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
      location: "",
      zipcode: "",
      city: "",
      state: "",
      country: "United States",
      countryId: 233,
      stateId: "",
    },
    validationSchema: communitySchema,
    onSubmit: async (values, { resetForm }) => {
      if (slugError) {
        return;
      }
      try {
        setLoading(true);
        const communityRes = await axios.post(
          `${BASE_URL}/communities/create`,
          {
            name: values.name.trim(),
            slug: values.urlSlug.trim(),
            description: values.description.trim(),
            address: values.location.trim(),
            zipcode: values.zipcode.trim(),
            city: values.city.trim(),
            state: values.state.trim(),
            country: values.country.trim(),
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
        enqueueSnackbar(error.response?.data?.message || error?.message, {
          variant: "error",
        });
        if (error?.response?.status === 401) {
          Cookies.remove("ownerToken");
          Cookies.remove("owner");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    showPopup && (
      <div
        className="
        fixed inset-0 z-50 
        bg-[rgba(0,0,0,0.4)]
        flex items-center justify-center 
        p-3 sm:p-5
      "
      >
        <form
          onSubmit={formik.handleSubmit}
          className="
          bg-[var(--white-bg)]
          w-full max-w-[471px]
          rounded-[18px]
          p-5 sm:p-7
          relative 
          max-h-[95vh]
          overflow-y-auto
        "
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between gap-5">
            <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] font-semibold leading-none max-w-[80%]">
              Add New Community
            </h3>

            <button
              type="button"
              onClick={() => setShowAddCommunityPopup(false)}
              className="
              w-[22px] h-[22px] 
              border border-[#989898] 
              rounded flex items-center justify-center
            "
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full border my-4 border-[#000000]/10" />

          {/* Form Fields */}
          <div className="w-full space-y-3">
            <TextField
              type="text"
              name="name"
              placeholder="Community name"
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
              placeholder="Community slug"
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

            {/* Description */}
            <div>
              <textarea
                name="description"
                id="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                placeholder="Community description..."
                className={`w-full h-[120px] sm:h-[140px] px-[15px] py-[12px] rounded-[8px] bg-[var(--secondary-bg)] outline-none resize-none
                ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500 border"
                    : "border border-transparent"
                }
              `}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Country & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {/* Country */}
            <div className="w-full flex flex-col gap-1">
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
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-xs">{formik.errors.country}</p>
              )}
            </div>

            {/* State */}
            <div className="w-full flex flex-col gap-1">
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

          {/* City & Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3.5">
            <div className="w-full flex flex-col gap-1">
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
              label=""
            />
          </div>

          {/* Location */}
          <TextField
            type="text"
            name="location"
            placeholder="Suite / Apartment / Street"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.location}
            touched={formik.touched.location}
            label=""
          />

          {/* Submit Button */}
          <div className="w-full mt-4 sm:mt-5">
            <Button type="submit" isLoading={loading} title="Add Community" />
          </div>
        </form>
      </div>
    )
  );
};

export default AddCommunity;
