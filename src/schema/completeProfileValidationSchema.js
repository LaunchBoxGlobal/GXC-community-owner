import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const completeProfileValidationSchema = (t) =>
  Yup.object({
    firstName: Yup.string()
      .trim(t("completeProfile.form.errors.firstName.trim"))
      .min(3, t("completeProfile.form.errors.firstName.min"))
      .max(10, t("completeProfile.form.errors.firstName.max"))
      .matches(
        /^[A-Za-z ]+$/,
        t("completeProfile.form.errors.firstName.invalid"),
      )
      .required(t("completeProfile.form.errors.firstName.required")),

    lastName: Yup.string()
      .trim(t("completeProfile.form.errors.lastName.trim"))
      .min(3, t("completeProfile.form.errors.lastName.min"))
      .max(10, t("completeProfile.form.errors.lastName.max"))
      .matches(
        /^[A-Za-z ]+$/,
        t("completeProfile.form.errors.lastName.invalid"),
      )
      .required(t("completeProfile.form.errors.lastName.required")),

    email: Yup.string()
      .trim(t("completeProfile.form.errors.email.trim"))
      .email(t("completeProfile.form.errors.email.invalid"))
      .required(t("completeProfile.form.errors.email.required")),

    phoneNumber: Yup.string()
      .required(t("completeProfile.form.errors.phoneNumber.required"))
      .test(
        "is-valid-phone",
        t("completeProfile.form.errors.phoneNumber.invalid"),
        (value) => {
          if (!value) return false;
          const phone = parsePhoneNumberFromString(value);
          return phone ? phone.isValid() : false;
        },
      ),

    location: Yup.string()
      .trim(t("completeProfile.form.errors.location.trim"))
      .min(1, t("completeProfile.form.errors.location.min"))
      .max(30, t("completeProfile.form.errors.location.max"))
      .required(t("completeProfile.form.errors.location.required")),

    zipcode: Yup.string()
      .trim(t("completeProfile.form.errors.zipcode.trim"))
      .matches(
        /^[A-Za-z0-9\- ]{4,10}$/,
        t("completeProfile.form.errors.zipcode.invalid"),
      )
      .required(t("completeProfile.form.errors.zipcode.required")),

    city: Yup.string().required(t("completeProfile.form.errors.city.required")),

    state: Yup.string().required(
      t("completeProfile.form.errors.state.required"),
    ),

    country: Yup.string().required(
      t("completeProfile.form.errors.country.required"),
    ),

    profileImage: Yup.mixed().nullable(),
  });
