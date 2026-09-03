import { useFormik } from "formik";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import {
  signUpInitialValues,
  signupValidationSchema,
} from "../../schema/signupSchema";
import { useSignupMutation } from "../../services/authApi/authApi";
import { useLazyCheckSlugAvailabilityQuery } from "../../services/communityApi/communityApi";
import { generateSlug } from "../../utils/generateSlug";
import { useTranslation } from "react-i18next";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const [checkSlugAvailability] = useLazyCheckSlugAvailabilityQuery();
  const [baseSlug, setBaseSlug] = useState("");
  const { t } = useTranslation("auth");

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

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: signUpInitialValues,
    validationSchema: signupValidationSchema(t),
    onSubmit: async (values, { resetForm }) => {
      try {
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

        const res = await signup(formData).unwrap();

        if (res?.success) {
          Cookies.set("ownerToken", res.data.token);
          Cookies.set("owner", JSON.stringify(res.data.user));
          Cookies.set("ownerEmail", values.email.trim());
          Cookies.set("slug", values.urlSlug.trim());
          Cookies.set("isOwnerEmailVerified", false);
          Cookies.set("page", "/signup");

          resetForm();

          navigate("/verify-otp", {
            state: { page: "/signup" },
          });
        }
      } catch (error) {
        console.log("signup error >>> ", error);
      }
    },
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    formik.setFieldValue(name, value);

    // Mark ONLY this field as touched while typing
    formik.setFieldTouched(name, true, false);

    // Validate ONLY this field
    await formik.validateField(name);
  };

  useEffect(() => {
    if (!formik.values.communityName) return;
    if (formik.touched.urlSlug) return;

    const slug = generateSlug(formik.values.communityName);
    setBaseSlug(slug);
    formik.setFieldValue("urlSlug", slug);
  }, [formik.values.communityName]);

  useEffect(() => {
    if (!formik.values.urlSlug) return;
    if (!baseSlug) return;

    const timer = setTimeout(async () => {
      try {
        const res = await checkSlugAvailability(baseSlug).unwrap();

        // Base slug taken → show error
        if (!res?.data?.available) {
          formik.setFieldError("urlSlug", `"${baseSlug}" is already taken`);

          // Now find a suggestion
          for (let i = 1; i <= 5; i++) {
            const suggestion = `${baseSlug}-${i}`;
            const retry = await checkSlugAvailability(suggestion).unwrap();

            if (retry?.data?.available) {
              formik.setFieldValue("urlSlug", suggestion);
              return;
            }
          }
        } else {
          // Base slug available → clear error
          formik.setFieldError("urlSlug", undefined);
        }
      } catch {
        formik.setFieldError(
          "urlSlug",
          t(`signupPage.form.errors.urlSlug.unable`),
        );
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [baseSlug]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[460px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center space-y-3">
        <h1 className="font-semibold text-[32px] leading-none">
          {t(`buttons.signup`)}
        </h1>
        <p className="text-[var(--secondary-color)]">
          {t(`signupPage.enterCredentials`)}
        </p>
      </div>

      <div className="w-full space-y-3 mt-5">
        <div className="w-full grid grid-cols-2 gap-2">
          <TextField
            type="text"
            name="firstName"
            placeholder={t(`signupPage.form.placeholders.firstName`)}
            value={formik.values.firstName}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            label={t(`signupPage.form.labels.firstName`)}
          />
          <TextField
            type="text"
            name="lastName"
            placeholder={t(`signupPage.form.placeholders.lastName`)}
            value={formik.values.lastName}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            label={t(`signupPage.form.labels.lastName`)}
          />
        </div>

        <TextField
          type="text"
          name="email"
          placeholder={t(`signupPage.form.placeholders.email`)}
          value={formik.values.email}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          label={t(`signupPage.form.labels.emailAddress`)}
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextField
            type="text"
            name="communityName"
            placeholder={t(`signupPage.form.placeholders.communityName`)}
            value={formik.values.communityName}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.communityName}
            touched={formik.touched.communityName}
            label={t(`signupPage.form.labels.communityName`)}
          />
          <TextField
            type="text"
            name="urlSlug"
            placeholder={t(`signupPage.form.placeholders.communityUrl`)}
            value={formik.values.urlSlug}
            onChange={handleChange}
            onBlur={
              //   async () => {
              //   const error = await validateSlug(formik.values.urlSlug);
              //   if (error) {
              //     formik.setFieldError("urlSlug", error);
              //   }
              // }
              formik.handleBlur
            }
            error={formik.errors.urlSlug}
            touched={formik.touched.urlSlug}
            label={t(`signupPage.form.labels.customUrl`)}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            {t(`signupPage.form.labels.communityDescription`)}
          </label>
          <textarea
            name="description"
            id="description"
            onChange={handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder={t(`signupPage.form.placeholders.communityDescription`)}
            className={`w-full border bg-[var(--secondary-bg)] min-h-[94px] max-h-[94px] px-[15px] py-[14px] rounded-[8px] outline-none ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-[var(--secondary-bg)]"
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Country, State, City, Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t(`signupPage.form.labels.communityCountry`)}
            </label>
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
                  ${formik.touched.country && formik.errors.country ? "!border-red-500" : "!border-gray-200"}`}
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
            <label className="text-sm font-medium">
              {t(`signupPage.form.labels.communityState`)}
            </label>
            <StateSelect
              countryid={formik.values.countryId || 0}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none ${formik.touched.state && formik.errors.state ? "!border-red-500" : "!border-gray-200"}`}
              placeHolder={t(`signupPage.form.placeholders.communityState`)}
              onChange={async (val) => {
                // Set the value first, then mark touched and revalidate this
                // field so a stale "required" error clears immediately on select.
                await formik.setFieldValue("state", val.name);
                formik.setFieldValue("stateId", val.id);
                formik.setFieldValue("city", "");
                formik.setFieldTouched("state", true, false);
                await formik.validateField("state");
              }}
            />
            {formik.touched.state && formik.errors.state && (
              <p className="text-red-500 text-xs">{formik.errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t(`signupPage.form.labels.communityCity`)}
            </label>
            <CitySelect
              countryid={formik.values.countryId || 0}
              stateid={formik.values.stateId || 0}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none ${formik.touched.city && formik.errors.city ? "!border-red-500" : "!border-gray-200"}`}
              placeHolder={t(`signupPage.form.placeholders.communityCity`)}
              onChange={async (val) => {
                // Same pattern as State: value -> touched -> validate.
                await formik.setFieldValue("city", val.name);
                formik.setFieldTouched("city", true, false);
                await formik.validateField("city");
              }}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-500 text-xs">{formik.errors.city}</p>
            )}
          </div>

          <TextField
            type="text"
            name="zipcode"
            placeholder={t(`signupPage.form.placeholders.communityZipcode`)}
            value={formik.values.zipcode}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.zipcode}
            touched={formik.touched.zipcode}
            label={t(`signupPage.form.labels.communityZipcode`)}
          />
        </div>

        <TextField
          type="text"
          name="location"
          placeholder={t(`signupPage.form.placeholders.suiteApartment`)}
          value={formik.values.location}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.location}
          touched={formik.touched.location}
          label={t(`signupPage.form.labels.suiteApartment`)}
        />

        <PasswordField
          name="password"
          placeholder={t(`signupPage.form.placeholders.password`)}
          value={formik.values.password}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          label={t(`signupPage.form.labels.password`)}
        />
        <PasswordField
          name="confirmPassword"
          placeholder={t(`signupPage.form.placeholders.password`)}
          value={formik.values.confirmPassword}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
          label={t(`signupPage.form.labels.confirmPassword`)}
        />

        <div className="pt-2">
          <Button
            type="submit"
            title={t(`buttons.signup`)}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-6 mt-4">
        <div className="w-full border border-gray-300" />
        <p className="text-gray-400 font-medium">{t(`loginPage.or`)}</p>
        <div className="w-full border border-gray-300" />
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            {t("signupPage.alreadyHaveAccount")}{" "}
          </p>
          <Link
            to={`/login`}
            className="font-medium text-[var(--primary-color)]"
          >
            {t(`buttons.signin`)}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
