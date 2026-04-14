import * as Yup from "yup";

export const settingsChangePasswordInitialValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export const settingsChangePasswordSchema = (t) =>
  Yup.object({
    currentPassword: Yup.string().required(t(`currentPassword`)),
    password: Yup.string()
      .min(8, t(`passwordMin`))
      .max(25, t(`passwordMax`))
      .matches(/[A-Z]/, t(`passwordUppercase`))
      .matches(/[a-z]/, t(`passwordLowercase`))
      .matches(/\d/, t(`passwordNumber`))
      .matches(/[@$!%*?&^#_.-]/, t(`passwordSpecialChar`))
      .required(t(`passwordRequired`)),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t(`passwordMatch`))
      .required(t(`confirmPassRequired`)),
  });
