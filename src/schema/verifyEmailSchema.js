import * as Yup from "yup";

export const verifyEmailInitialValues = {
  email: "",
};

export const verifyEmailSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .trim(t(`forgotPasswordPage.form.errors.email.trim`))
      .email(t(`forgotPasswordPage.form.errors.email.invalid`))
      .required(t(`forgotPasswordPage.form.errors.email.required`)),
  });
