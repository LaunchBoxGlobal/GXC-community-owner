import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import Button from "../../components/Common/Button";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import {
  communityInitialValue,
  communitySchema,
} from "../../schema/communitySchema";
import {
  useLazyCheckSlugAvailabilityQuery,
  useAddCommunityMutation,
} from "../../services/communityApi/communityApi";
import { useCallback, useRef } from "react";
import { generateSlug } from "../../utils/generateSlug";

const AddCommunity = ({
  showPopup,
  togglePopup,
  setCommunityUrl,
  setShowAddCommunityPopup,
  setShowSuccessPopup,
  t,
}) => {
  const [slugError, setSlugError] = useState(null);
  const debounceTimer = useRef(null);
  const [baseSlug, setBaseSlug] = useState("");

  const [addCommunity, { isLoading: loading }] = useAddCommunityMutation();
  const [checkSlugAvailability] = useLazyCheckSlugAvailabilityQuery();

  const handleCheckSlugAvailability = async (slug) => {
    if (!slug || slug.length < 3) {
      setSlugError(t(`communitiesPage.addCommunity.slugValidation.min`));
      return;
    }

    try {
      const res = await checkSlugAvailability(slug).unwrap();
      const available = res?.data?.available;

      if (!available) {
        setSlugError(t(`communitiesPage.addCommunity.slugValidation.taken`));
      } else {
        setSlugError(null);
      }
    } catch {
      setSlugError(t(`communitiesPage.addCommunity.slugValidation.error`));
    }
  };

  const debouncedSlugCheck = useCallback((slug) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      handleCheckSlugAvailability(slug);
    }, 600); // waits 600ms after user stops typing
  }, []);

  const formik = useFormik({
    validateOnBlur: true,
    initialValues: communityInitialValue,
    validationSchema: communitySchema(t),
    onSubmit: async (values, { resetForm }) => {
      if (slugError) return;

      try {
        const res = await addCommunity({
          name: values.name.trim(),
          slug: values.urlSlug.trim(),
          description: values.description.trim(),
          address: values.location.trim(),
          zipcode: values.zipcode.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          country: values.country.trim(),
        }).unwrap();

        if (res?.success) {
          Cookies.set("slug", res?.data?.community?.slug);
          resetForm();
          togglePopup();
          setShowAddCommunityPopup(false);
          setShowSuccessPopup(true);
          setCommunityUrl(values.urlSlug);
        }
      } catch (error) {
        enqueueSnackbar(error?.data?.message || error?.message, {
          variant: "error",
        });

        if (error?.status === 401) {
          Cookies.remove("ownerToken");
          Cookies.remove("owner");
          navigate("/login");
        }
      }
    },
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    formik.setFieldValue(name, value);

    // mark current field as touched
    formik.setFieldTouched(name, true, false);

    // validate only this field
    await formik.validateField(name);
  };

  // Create a reusable close handler
  const handleClose = () => {
    formik.resetForm();
    setSlugError(null);
    setBaseSlug("");
    setShowAddCommunityPopup(false);
  };

  // Auto-generate slug from community name
  useEffect(() => {
    if (!formik.values.name) return;
    if (formik.touched.urlSlug) return;

    const slug = generateSlug(formik.values.name);
    setBaseSlug(slug);
    formik.setFieldValue("urlSlug", slug);
  }, [formik.values.name]);

  // Check availability of the auto-generated slug
  useEffect(() => {
    if (!formik.values.urlSlug) return;
    if (!baseSlug) return;

    const timer = setTimeout(async () => {
      try {
        const res = await checkSlugAvailability(baseSlug).unwrap();

        if (!res?.data?.available) {
          setSlugError(`"${baseSlug}" is already taken`);

          for (let i = 1; i <= 5; i++) {
            const suggestion = `${baseSlug}-${i}`;
            const retry = await checkSlugAvailability(suggestion).unwrap();

            if (retry?.data?.available) {
              setSlugError(null);
              formik.setFieldValue("urlSlug", suggestion);
              return;
            }
          }
        } else {
          setSlugError(null);
        }
      } catch {
        setSlugError(t(`communitiesPage.addCommunity.slugValidation.error`));
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [baseSlug]);

  return (
    showPopup && (
      <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center p-3 sm:p-5">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-[var(--white-bg)] w-full max-w-[471px] rounded-[18px] p-5 sm:p-7 relative max-h-[95vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between gap-5">
            <h3 className="text-[18px] sm:text-[20px] lg:text-[24px] font-semibold leading-none max-w-[80%]">
              {t(`communitiesPage.addCommunity.title`)}
            </h3>

            <button
              type="button"
              onClick={() => {
                handleClose();
                setShowAddCommunityPopup(false);
              }}
              className="w-[22px] h-[22px] border border-[#989898] rounded flex items-center justify-center"
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
              placeholder={t("communitiesPage.addCommunity.placeholders.name")}
              value={formik.values.name}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name}
              label={null}
            />

            <TextField
              type="text"
              name="urlSlug"
              placeholder={t("communitiesPage.addCommunity.placeholders.slug")}
              value={formik.values.urlSlug}
              // onChange={(e) => {
              //   formik.handleChange(e);
              //   debouncedSlugCheck(e.target.value);
              // }}
              onChange={(e) => {
                formik.handleChange(e);
                setBaseSlug(e.target.value); // ← keeps availability check in sync
                debouncedSlugCheck(e.target.value);
              }}
              onBlur={(e) => {
                formik.handleBlur(e);
                handleCheckSlugAvailability(e.target.value);
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
                onChange={handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                placeholder={t(
                  "communitiesPage.addCommunity.placeholders.description",
                )}
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
                placeHolder={t(
                  "communitiesPage.addCommunity.placeholders.country",
                )}
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
                placeHolder={t(
                  "communitiesPage.addCommunity.placeholders.state",
                )}
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
                placeHolder={t(
                  "communitiesPage.addCommunity.placeholders.city",
                )}
                onChange={(val) => formik.setFieldValue("city", val.name)}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="text-red-500 text-xs">{formik.errors.city}</p>
              )}
            </div>

            <TextField
              type="text"
              name="zipcode"
              placeholder={t(
                "communitiesPage.addCommunity.placeholders.zipcode",
              )}
              value={formik.values.zipcode}
              onChange={handleChange}
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
            placeholder={t(
              "communitiesPage.addCommunity.placeholders.location",
            )}
            value={formik.values.location}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.location}
            touched={formik.touched.location}
            label=""
          />

          {/* Submit Button */}
          <div className="w-full mt-4 sm:mt-5">
            <Button
              type="submit"
              isLoading={loading}
              title={t("communitiesPage.buttons.submit")}
            />
          </div>
        </form>
      </div>
    )
  );
};

export default AddCommunity;
