import { useEffect } from "react";
import TextField from "../Common/TextField";
import { useFormik } from "formik";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { requestNotificationPermission } from "../../notifications";
import {
  useLoginMutation,
  useResendOtpMutation,
} from "../../services/authApi/authApi";
import { loginInitialValues, loginSchema } from "../../schema/loginSchema";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice/userSlice";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("auth");

  const [login, { isLoading }] = useLoginMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();

  useEffect(() => {
    document.title = `Login - giveXchange`;
  }, []);

  const formik = useFormik({
    validateOnBlur: true,
    validateOnChange: false,
    initialValues: loginInitialValues,
    validationSchema: loginSchema(t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await login({
          email: values?.email.trim(),
          password: values?.password.trim(),
          userType: "community_owner",
        }).unwrap();

        if (response?.success) {
          Cookies.set("ownerToken", response?.data?.token);
          Cookies.set("owner", JSON.stringify(response?.data?.user));
          requestNotificationPermission();
          resetForm();
          navigate("/");
        }
      } catch (error) {
        console.error("login error:", error?.response);

        const apiRes = error?.response?.data;

        if (
          apiRes?.message === "Please verify your email before logging in" &&
          apiRes?.data?.token
        ) {
          const newToken = apiRes.data.token;
          Cookies.set("ownerToken", newToken);
          Cookies.set("owner", JSON.stringify(res?.data?.data?.user));
          dispatch(setUser(res?.data?.data?.user));
          Cookies.set("page", "/login");

          try {
            const resendRes = await resendOtp({ email: values.email }).unwrap();

            if (resendRes?.success) {
              Cookies.set("userEmail", values.email);
              enqueueSnackbar(
                resendRes?.message ||
                  t(`loginPage.form.messages.verificationCodeSent`),
                {
                  variant: "success",
                },
              );
              navigate("/verify-otp", {
                state: {
                  email: values.email,
                  page: "/login",
                },
              });
            }
          } catch (err) {
            enqueueSnackbar(err.response?.data?.message || err.message, {
              variant: "error",
            });
          }
        } else {
        }
      }
    },
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    formik.setFieldValue(name, value);

    // mark current field as touched
    formik.setFieldTouched(name, true, false);

    // validate only this field
    await formik.validateField(name);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <img
        src="/logo.svg"
        alt="logo"
        className="w-[167px] lg:w-[267px] object-contain mx-auto"
      />
      <div className="w-full text-center space-y-3">
        <h2 className="font-semibold text-[32px] leading-none">
          {t(`loginPage.welcomeBack`)}
        </h2>
        <p className="text-[var(--secondary-color)]">
          {t(`loginPage.enterCredentials`)}
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-3">
        <TextField
          type="text"
          name="email"
          placeholder="johndoe@gmail.com"
          value={formik.values.email}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
          label={t(`loginPage.form.labels.email`)}
        />

        <PasswordField
          name={`password`}
          placeholder={t(`loginPage.form.labels.password`)}
          value={formik.values.password}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
          label={t(`loginPage.form.labels.password`)}
        />

        <div className="w-full text-end">
          <Link to={`/forgot-password`} className="text-xs font-medium">
            {t(`buttons.forgotPassword`)}
          </Link>
        </div>

        <div className="pt-2 w-full">
          <Button
            type={"submit"}
            title={t(`buttons.login`)}
            isLoading={isLoading || isResendingOtp}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-6 mt-4">
        <div className="w-full border border-gray-300" />
        <p className="text-gray-400 font-medium">{t(`loginPage.or`)}</p>
        <div className="w-full border border-gray-300" />
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            {t(`loginPage.DontHaveAccount`)}{" "}
          </p>
          <Link
            to={`/signup`}
            className="font-medium text-[var(--primary-color)]"
          >
            {t(`buttons.signup`)}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
