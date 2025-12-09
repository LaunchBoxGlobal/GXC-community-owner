import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Button from "../../components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageUpload from "./ImageUpload";
import { enqueueSnackbar } from "notistack";

const ReportingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Reporting - giveXchange";
  }, []);

  const formik = useFormik({
    initialValues: {
      description: "",
      images: [],
    },

    validationSchema: Yup.object({
      description: Yup.string()
        .min(10, "Description must be 10 characters or more")
        .max(1500, "Description must be 1500 characters or less")
        .required("Description is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("description", values.description);

        // Append images only if available
        values.images.forEach((img) => {
          formData.append("images", img);
        });
        // formData,

        const response = await axios.post(
          `${BASE_URL}/reports/bugs`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          enqueueSnackbar(
            response?.data?.message || "Bug report submitted successfully",
            { variant: "success" }
          );
          resetForm();
        }
      } catch (error) {
        enqueueSnackbar(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong on the server.",
          { variant: "error" }
        );

        // handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-transparent rounded-[10px] min-h-screen"
      >
        <div className="w-full">
          <h2 className="text-lg lg:text-[24px] font-semibold leading-none">
            Make a Report
          </h2>
        </div>
        <div className="w-full border my-5" />
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4">
          <div className="w-full">
            <h2 className="font-medium text-[var(--button-bg)]">
              Having trouble using the app?
            </h2>
            <p className="font-medium">
              Send us a report and we'll look into it right away.
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
            <Button title={"Send"} type={"submit"} isLoading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportingPage;
