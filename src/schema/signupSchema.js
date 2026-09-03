import * as Yup from "yup";

export const signUpInitialValues = {
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  communityName: "",
  description: "",
  urlSlug: "",
  location: "",
  zipcode: "",
  country: "United States",
  countryId: 233,
  state: "",
  stateId: "",
  city: "",
};

export const signupValidationSchema = (t) =>
  Yup.object({
    firstName: Yup.string()
      .trim(t(`signupPage.form.errors.firstName.trim`))
      .min(3, t(`signupPage.form.errors.firstName.min`))
      .max(10, t(`signupPage.form.errors.firstName.max`))
      .matches(/^[A-Za-z ]+$/, t(`signupPage.form.errors.firstName.invalid`))
      .required(t(`signupPage.form.errors.firstName.required`)),
    lastName: Yup.string()
      .trim(t(`signupPage.form.errors.lastName.trim`))
      .min(3, t(`signupPage.form.errors.lastName.min`))
      .max(10, t(`signupPage.form.errors.lastName.max`))
      .matches(/^[A-Za-z ]+$/, t(`signupPage.form.errors.lastName.invalid`))
      .required(t(`signupPage.form.errors.lastName.required`)),
    communityName: Yup.string()
      .trim(t(`signupPage.form.errors.communityName.trim`))
      .min(3, t(`signupPage.form.errors.communityName.min`))
      .max(35, t(`signupPage.form.errors.communityName.max`))
      .required(t(`signupPage.form.errors.communityName.required`)),
    urlSlug: Yup.string()
      .trim(t(`signupPage.form.errors.urlSlug.trim`))
      .min(3, t(`signupPage.form.errors.urlSlug.min`))
      .max(50, t(`signupPage.form.errors.urlSlug.max`))
      .matches(/^[a-z0-9-]+$/, t(`signupPage.form.errors.urlSlug.invalid`))
      .required(t(`signupPage.form.errors.urlSlug.required`)),
    description: Yup.string()
      .trim(t(`signupPage.form.errors.description.trim`))
      .min(11, t(`signupPage.form.errors.description.min`))
      .max(150, t(`signupPage.form.errors.description.max`))
      .required(t(`signupPage.form.errors.description.required`)),
    email: Yup.string()
      .trim(t(`signupPage.form.errors.email.trim`))
      .email(t(`signupPage.form.errors.email.invalid`))
      .matches(
        /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        t(`signupPage.form.errors.email.format`),
      )
      .matches(
        /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
        t(`signupPage.form.errors.email.noConsecutive`),
      )
      .required("Email address is required"),
    password: Yup.string()
      .trim(t(`signupPage.form.errors.password.trim`))
      .min(8, t(`signupPage.form.errors.password.min`))
      .max(25, t(`signupPage.form.errors.password.max`))
      .matches(/[A-Z]/, t(`signupPage.form.errors.password.uppercase`))
      .matches(/[a-z]/, t(`signupPage.form.errors.password.lowercase`))
      .matches(/\d/, t(`signupPage.form.errors.password.number`))
      .matches(/[@$!%*?&^#_.-]/, t(`signupPage.form.errors.password.special`))
      .required(t(`signupPage.form.errors.password.required`)),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        t(`signupPage.form.errors.confirmPassword.match`),
      )
      .required(t(`signupPage.form.errors.confirmPassword.required`)),
    location: Yup.string()
      .trim(t(`signupPage.form.errors.location.trim`))
      .min(1, t(`signupPage.form.errors.location.min`))
      .max(60, t(`signupPage.form.errors.location.max`))
      .required(t(`signupPage.form.errors.location.required`)),

    zipcode: Yup.string()
      .trim(t(`signupPage.form.errors.zipcode.trim`))
      .matches(
        /^[A-Za-z0-9\- ]{4,10}$/,
        t(`signupPage.form.errors.zipcode.invalid`),
      )
      .required(t(`signupPage.form.errors.zipcode.required`)),

    city: Yup.string().required(t(`signupPage.form.errors.city.required`)),
    state: Yup.string().required(t(`signupPage.form.errors.state.required`)),
    country: Yup.string().required(
      t(`signupPage.form.errors.country.required`),
    ),
    profileImage: Yup.mixed().nullable(),
  });
