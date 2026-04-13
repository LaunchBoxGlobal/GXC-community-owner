import * as Yup from "yup";

export const loginInitialValues = {
  email: "",
  password: "",
};

export const loginSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .email(t(`loginPage.form.errors.invalidEmail`))
      .required(t(`loginPage.form.errors.emailRequired`)),
    password: Yup.string().required(
      t(`loginPage.form.errors.passwordRequired`),
    ),
  });
