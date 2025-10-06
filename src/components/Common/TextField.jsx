import React from "react";

const TextField = ({
  name,
  value,
  onChange,
  onBlur,
  type,
  placeholder,
  error,
  touched,
  label,
  disabled,
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor="" className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        autoComplete="off"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        className={`w-full border h-[49px] px-[15px] py-[14px] rounded-[8px] outline-none bg-[var(--secondary-bg)]
          ${
            error && touched ? "border-red-500" : "border-[#D9D9D9]"
          } disabled:bg-gray-50 disabled:cursor-not-allowed`}
      />
      {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TextField;
