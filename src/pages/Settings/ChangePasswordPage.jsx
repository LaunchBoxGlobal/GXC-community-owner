import { useFormik } from "formik";
import PasswordField from "../../components/Common/PasswordField";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import {
  settingsChangePasswordInitialValues,
  settingsChangePasswordSchema,
} from "../../schema/settingsChangePasswordSchema";
import { useSettingsChangePasswordMutation } from "../../services/userApi/userApi";
import { useTranslation } from "react-i18next";

const ChangePasswordPage = () => {
  const [settingsChangePassword, { isLoading }] =
    useSettingsChangePasswordMutation();
  const { t } = useTranslation("settings");

  const formik = useFormik({
    initialValues: settingsChangePasswordInitialValues,
    validationSchema: settingsChangePasswordSchema(t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await settingsChangePassword({
          password: values?.password,
          oldPassword: values.currentPassword,
        }).unwrap();

        if (res?.success) {
          resetForm();
          enqueueSnackbar(t("Password changed successfully"), {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("change password error:", error.response?.data);
      }
    },
  });

  return (
    <div className="w-full">
      <h1 className="font-semibold text-[24px]">{t(`Change Password`)}</h1>

      <div className="w-full border my-4" />

      <form
        onSubmit={formik.handleSubmit}
        className="w-full mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="currentPassword"
              placeholder={t("Current Password")}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.currentPassword}
              touched={formik.touched.currentPassword}
              label={t("Current Password")}
            />
          </div>
        </div>
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="password"
              placeholder={t("New Password")}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              label={t("New Password")}
            />
          </div>
        </div>
        <div className="hidden lg:block w-full"></div>
        <div className="w-full gap-5">
          <div className="">
            <PasswordField
              name="confirmPassword"
              placeholder={t("Confirm Password")}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              label={t("Confirm Password")}
            />
          </div>
        </div>
        <div className="hidden lg:block w-full"></div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="bg-[var(--button-bg)] button max-w-[150px]"
          >
            {isLoading ? <Loader /> : t("Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
