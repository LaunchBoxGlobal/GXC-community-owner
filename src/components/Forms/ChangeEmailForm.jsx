import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { useResendOtpMutation } from "../../services/authApi/authApi";

const ChangeEmailForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Change Email - giveXchange`;
  }, []);

  const [resendOtp, { isLoading }] = useResendOtpMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim("Email address can not start or end with spaces")
        .email("Invalid email address")
        .required("Email address is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await resendOtp({ newEmail: values.email.trim() }).unwrap();

        if (res?.success) {
          Cookies.set("ownerEmail", values.email);
          Cookies.set("isOwnerEmailVerified", false);
          enqueueSnackbar(res?.message, {
            variant: "success",
          });
          resetForm();
          navigate(`/verify-otp`, {
            state: {
              page: "/signup",
              email: values.email,
            },
          });
        }
      } catch (error) {
        console.error("verify email error:", error);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center">
        <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
          Change Email Address
        </h2>
        <p className="text-[var(--secondary-color)]">
          Enter your new email address below
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-4">
        <div className="w-full">
          <TextField
            type="text"
            name="email"
            placeholder="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            label={"Email Address"}
          />
        </div>

        <div className="pt-2 w-full">
          <Button type={"submit"} title={`Update`} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium flex items-center gap-1 text-[var(--button-bg)]"
        >
          <div className="w-[18px] h-[18px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <RiArrowLeftSLine className="text-white text-base" />
          </div>
          Back
        </button>
      </div>
    </form>
  );
};

export default ChangeEmailForm;
