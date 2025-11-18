import { useFormik } from "formik";
import * as Yup from "yup";

const SupportPage = () => {
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(10, "Description must be 10 characters or more.")
        .max(1500, "Description must be 1500 characters or less")
        .required("Description is required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="w-full relative pt-2">
      <h2 className="text-[24px] font-semibold leading-none">Support</h2>
      <div className="w-full border my-5" />

      <div className="w-full mt-5"></div>

      <form onSubmit={formik.handleSubmit} className="w-full">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="bg-[#F5F5F5] rounded-[12px] px-5 py-4 text-gray-600 mt-1 outline-none w-full h-[166px] resize-none"
        ></textarea>

        {formik.touched.description && formik.errors.description ? (
          <span className="text-red-500 text-sm">
            {formik.errors.description}
          </span>
        ) : null}

        <div className="w-full mt-2 flex justify-end">
          <button type="submit" className="button max-w-[160px]">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportPage;
