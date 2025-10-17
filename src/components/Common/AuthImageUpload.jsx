import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const AuthImageUpload = ({ name, setFieldValue, error }) => {
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, and JPEG images are allowed");
      setPreview(null);
      setFieldValue(name, null);
      return;
    }

    setFileError("");
    setPreview(URL.createObjectURL(file));
    setFieldValue(name, file);
  };

  return (
    <div className="w-full flex items-center justify-start gap-4">
      <label
        htmlFor="profileImage"
        className="bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FiPlus className="text-3xl" />
        )}
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <div>
        <label
          htmlFor="profileImage"
          className={`underline text-[15px] font-medium cursor-pointer ${
            !error && !fileError ? "text-[var(--primary-blue)]" : "text-red-500"
          }`}
        >
          Upload Profile Picture
        </label>

        {(error || fileError) && (
          <p className="text-xs text-red-500 mt-1">
            {fileError || "* Required field"}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthImageUpload;
