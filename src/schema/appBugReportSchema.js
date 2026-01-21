import * as Yup from "yup";

export const appBugReportInitialValues = {
  description: "",
  images: [],
};

export const appBugReportValidationSchema = Yup.object({
  description: Yup.string()
    .min(10, "Description must be 10 characters or more")
    .max(1500, "Description must be 1500 characters or less")
    .required("Description is required"),
});
