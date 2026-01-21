import * as Yup from "yup";

export const settingsChangePasswordInitialValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export const settingsChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Enter your current password"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password cannot be more than 25 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&^#_.-]/,
      "Password must contain at least one special character"
    )
    .required("Enter your new password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
});
