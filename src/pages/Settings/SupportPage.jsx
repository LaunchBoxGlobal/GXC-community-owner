import { useEffect } from "react";
import Button from "../../components/Common/Button";
import { useFormik } from "formik";
import ImageUpload from "./ImageUpload";
import { enqueueSnackbar } from "notistack";
import {
  appBugReportInitialValues,
  appBugReportValidationSchema,
} from "../../schema/appBugReportSchema";
import { useSubmitBugReportMutation } from "../../services/reportsApi/reportsApi";
import { useTranslation } from "react-i18next";

const ReportingPage = () => {
  const [submitBugReport, { isLoading: loading }] =
    useSubmitBugReportMutation();
  const { t } = useTranslation("settings");

  useEffect(() => {
    document.title = `${t(`Reporting`)} - giveXchange`;
  }, []);

  const formik = useFormik({
    initialValues: appBugReportInitialValues,

    validationSchema: appBugReportValidationSchema(t),

    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("description", values.description);

        values.images.forEach((img) => {
          formData.append("images", img);
        });

        const response = await submitBugReport(formData).unwrap();

        if (response?.success) {
          enqueueSnackbar(
            response?.message || t("Bug report submitted successfully"),
            { variant: "success" },
          );
          resetForm();
        }
      } catch (error) {}
    },
  });

  useEffect(() => {
    formik.validateForm();
  }, [t]);

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-transparent rounded-[10px] min-h-screen"
      >
        <div className="w-full">
          <h2 className="text-lg lg:text-[24px] font-semibold leading-none">
            {t(`Make a Report`)}
          </h2>
        </div>
        <div className="w-full border my-5" />
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4">
          <div className="w-full">
            <h2 className="font-medium text-[var(--button-bg)]">
              {t(`Having trouble using the app?`)}
            </h2>
            <p className="font-medium">
              {t(`Send us a report and we'll look into it right away.`)}
            </p>
          </div>

          <div className="w-full grid grid-cols-3 gap-4">
            <div className="w-full mt-4 col-span-3 lg:col-span-2">
              <textarea
                name="description"
                placeholder="Enter description..."
                className="w-full bg-white rounded-[18px] relative p-5 min-h-[185px] text-base resize-none outline-none"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <ImageUpload
              images={formik.values.images}
              setImages={(imgs) => formik.setFieldValue("images", imgs)}
            />
          </div>
        </div>

        <div className="w-full flex justify-end mt-10">
          <div className="w-full max-w-[190px]">
            <Button title={t("Send")} type={"submit"} isLoading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportingPage;
