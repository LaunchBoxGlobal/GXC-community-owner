import * as Yup from "yup";

export const appBugReportInitialValues = {
  description: "",
  images: [],
};

export const appBugReportValidationSchema = (t) =>
  Yup.object({
    description: Yup.string()
      .min(10, t(`minDescription`))
      .max(1500, t(`maxDescription`))
      .required(t(`descriptionRequired`)),
  });
