import React, { useState } from "react";
import { BASE_URL } from "../../data/baseUrl";
import axios from "axios";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Loader/Loader";

const SuspendUuserButton = ({ member, communityId, fetchMemberDetails }) => {
  const [loading, setLoading] = useState(false);
  console.log(member);

  const membererShipStatus =
    member?.membership?.status === "banned" ? "Unsuspend" : "Suspend";

  const handleblockUser = async () => {
    setLoading(true);
    const userStatus =
      member?.membership?.status === "banned" ? "unban" : "ban";
    try {
      const res = await axios.post(
        `${BASE_URL}/communities/${communityId}/members/${member?.member?.id}/${userStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar(res?.data?.message || "Member unbanned successfully!", {
          variant: "success",
        });
        fetchMemberDetails();
      }
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Try again"
      );
      //   handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleblockUser()}
        className="button"
      >
        {loading ? <Loader /> : membererShipStatus}
      </button>
    </div>
  );
};

export default SuspendUuserButton;
