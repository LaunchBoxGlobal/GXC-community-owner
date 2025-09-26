import axios from "axios";
import React from "react";

const ResentOtp = ({ email }) => {
  const handleResentOtp = async () => {
    try {
      const res = await axios.post();
    } catch (error) {}
  };
  return (
    <button type="button" className="font-medium">
      Resend
    </button>
  );
};

export default ResentOtp;
