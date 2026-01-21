import * as Yup from "yup";

export const verifyEmailInitialValues = {
  email: "",
};

export const verifyEmailSchema = Yup.object({
  email: Yup.string()
    .trim("Email address can not start or end with spaces")
    .email("Invalid email address")
    .required("Email addres is required"),
});
