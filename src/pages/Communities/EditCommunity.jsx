import { IoClose } from "react-icons/io5";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import { useEffect } from "react";
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
import { useEditCommunityMutation } from "../../services/communityApi/communityApi";
import { useTranslation } from "react-i18next";

const EditCommunity = ({
  setShowEditCommunityPopup,
  showEditCommunityPopup,
  community,
  fetchCommunityDetails,
}) => {
  const [editCommunity, { isLoading: loading }] = useEditCommunityMutation();

  const { t } = useTranslation("communities");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: community?.name || "",
      urlSlug: community?.slug || "",
      description: community?.description || "",
      location: community?.address || "",
      zipcode: community?.zipcode || "",
      city: community?.city || "",
      state: community?.state || "",
      country: community?.country || "United States",
      countryId: 233,
      stateId: "",
    },
    validationSchema: communitySchema(t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await editCommunity({
          id: community?.id,
          data: {
            name: values.name.trim(),
            slug: values.urlSlug.trim(),
            description: values.description.trim(),
            address: values.location.trim(),
            city: values.city.trim(),
            state: values.state.trim(),
            zipcode: values.zipcode.trim(),
            country: values.country.trim(),
          },
        }).unwrap();

        if (res?.success) {
          Cookies.set("slug", res?.data?.community?.slug);
          resetForm();
          setShowEditCommunityPopup(false);
          fetchCommunityDetails();
          enqueueSnackbar(res?.message, { variant: "success" });
        }
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (community?.state) {
      fetch(`https://countriesnow.space/api/v0.1/countries/states`)
        .then((res) => res.json())
        .then((data) => {
          const usa = data.data.find((c) => c.name === "United States");
          const selectedState = usa.states.find(
            (s) => s.name.toLowerCase() === community.state.toLowerCase(),
          );
          if (selectedState) {
            formik.setFieldValue("stateId", selectedState?.id);
            formik.setFieldValue("countryId", 233);
          }
        });
    }
  }, [community]);

  return (
    showEditCommunityPopup && (
      <div className="w-full h-screen flex items-center justify-center px-5 fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)]">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-[var(--white-bg)] p-7 rounded-[18px] relative w-full max-w-[471px] max-h-[80vh] lg:max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="w-full flex items-center justify-between gap-5">
            <h3 className="text-[20px] lg:text-[24px] font-semibold leading-none max-w-[80%]">
              {t(`communitiesPage.buttons.editCommunity`)}
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

          <div className="w-full space-y-3 overflow-y-auto pr-1">
            <TextField
              type="text"
              name="name"
              placeholder={t(`editCommunity.form.placeholders.communityName`)}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name}
              label={t(`editCommunity.form.labels.communityName`)}
            />

            <TextField
              type="text"
              name="urlSlug"
              placeholder={t(`editCommunity.form.labels.urlSlug`)}
              value={formik.values.urlSlug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
              error={formik.errors.urlSlug}
              touched={formik.touched.urlSlug}
              label={t(`editCommunity.form.labels.communitySlug`)}
            />

            <div className="">
              <label htmlFor="description" className="text-sm font-medium">
                {t(`editCommunity.form.labels.communityDescription`)}
              </label>
              <textarea
                name="description"
                id="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                placeholder={t(
                  `editCommunity.form.placeholders.communityDescription`,
                )}
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

            {/* Country & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {/* Country */}
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                  {t(`editCommunity.form.labels.country`)}
                </label>
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
                  placeHolder={t(`editCommunity.form.placeholders.country`)}
                  onChange={(val) => {
                    formik.setFieldValue("country", val.name);
                    formik.setFieldValue("countryId", val.id);
                    formik.setFieldValue("state", "");
                    formik.setFieldValue("stateId", "");
                    formik.setFieldValue("city", "");
                  }}
                />
                {formik.touched.country && formik.errors.country && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.country}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                  {t(`editCommunity.form.labels.state`)}
                </label>
                <StateSelect
                  countryid={formik.values.countryId || undefined}
                  containerClassName="w-full"
                  inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                    formik.touched.state && formik.errors.state
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeHolder={t(`editCommunity.form.placeholders.state`)}
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
                  <p className="text-red-500 text-xs">{formik.errors.state}</p>
                )}
              </div>
            </div>

            {/* City & Zip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3.5">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                  {t(`editCommunity.form.labels.city`)}
                </label>
                <CitySelect
                  countryid={formik.values.countryId || undefined}
                  stateid={formik.values.stateId || undefined}
                  containerClassName="w-full"
                  inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  placeHolder={t(`editCommunity.form.placeholders.city`)}
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
                placeholder={t(`editCommunity.form.placeholders.zipcode`)}
                value={formik.values.zipcode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.zipcode}
                touched={formik.touched.zipcode}
                label={t(`editCommunity.form.labels.zipcode`)}
              />
            </div>

            {/* Location */}
            <TextField
              type="text"
              name="location"
              placeholder={t(`editCommunity.form.placeholders.location`)}
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.location}
              touched={formik.touched.location}
              label={t(`editCommunity.form.labels.location`)}
            />

            <div className="w-full">
              <Button
                type={`submit`}
                isLoading={loading}
                title={t(`editCommunity.form.buttons.save`)}
              />
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default EditCommunity;
