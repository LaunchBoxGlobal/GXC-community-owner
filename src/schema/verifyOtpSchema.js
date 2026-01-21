import * as Yup from "yup";

export const verifyOtpInitialValues = {
  otp: ["", "", "", "", "", ""],
};

export const verifyOtpValidationSchema = Yup.object({
  otp: Yup.array()
    .test("complete", "OTP is required", (arr) =>
      arr.every((digit) => digit !== "")
    )
    .test("valid", "OTP must be 6 digits", (arr) =>
      /^\d{6}$/.test(arr.join(""))
    ),
});
