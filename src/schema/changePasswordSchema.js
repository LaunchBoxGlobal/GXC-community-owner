import * as Yup from "yup";

export const changePasswordInitialValues = {
  password: "",
  confirmPassword: "",
};

export const changePasswordSchema = Yup.object({
  password: Yup.string()
    .trim("Password can not start or end with spaces")
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password cannot be more than 25 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&^#_.-]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Password is required"),
});
